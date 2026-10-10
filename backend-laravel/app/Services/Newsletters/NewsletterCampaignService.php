<?php

namespace App\Services\Newsletters;

use App\Jobs\Newsletters\SendNewsletterDeliveryJob;
use App\Models\Newsletter;
use App\Models\NewsletterDelivery;
use App\Models\NewsletterSubscriber;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NewsletterCampaignService
{
    public function __construct(
        private readonly ResendMailService $mail,
    ) {}

    /** Eligible recipient count — confirmed subscribers only. */
    public function eligibleRecipientCount(): int
    {
        return (int) NewsletterSubscriber::query()
            ->where('status', NewsletterSubscriber::STATUS_SUBSCRIBED)
            ->whereNotNull('emailVerifiedAt')
            ->count();
    }

    public function createDraft(array $data, ?string $createdBy = null): Newsletter
    {
        return Newsletter::create([
            'subject' => $data['subject'],
            'previewText' => $data['previewText'] ?? null,
            'contentHtml' => $data['contentHtml'],
            'contentText' => $data['contentText'] ?? null,
            'status' => Newsletter::STATUS_DRAFT,
            'createdBy' => $createdBy,
        ]);
    }

    public function updateDraft(Newsletter $newsletter, array $data): Newsletter
    {
        if ($newsletter->status !== Newsletter::STATUS_DRAFT) {
            throw new \DomainException('Only drafts can be edited.');
        }
        $newsletter->fill(array_filter([
            'subject' => $data['subject'] ?? null,
            'previewText' => $data['previewText'] ?? null,
            'contentHtml' => $data['contentHtml'] ?? null,
            'contentText' => $data['contentText'] ?? null,
        ], fn ($v) => $v !== null));
        $newsletter->save();
        return $newsletter;
    }

    /**
     * Transition the campaign to "sending" and enqueue a per-recipient job
     * for each confirmed subscriber. Idempotent against double-send attempts.
     *
     * @return array{queued: int, newsletter: Newsletter}
     */
    public function dispatch(Newsletter $newsletter): array
    {
        return DB::transaction(function () use ($newsletter) {
            $fresh = Newsletter::query()
                ->whereKey($newsletter->id)
                ->lockForUpdate()
                ->first();

            if (! $fresh) {
                throw new \DomainException('Newsletter not found.');
            }
            if (! $fresh->canSend()) {
                throw new \DomainException('This newsletter is already being sent or has been sent.');
            }

            $fresh->status = Newsletter::STATUS_SENDING;
            $fresh->startedAt = Carbon::now();
            $fresh->save();

            $queued = 0;
            NewsletterSubscriber::query()
                ->where('status', NewsletterSubscriber::STATUS_SUBSCRIBED)
                ->whereNotNull('emailVerifiedAt')
                ->orderBy('createdAt')
                ->chunkById(500, function ($chunk) use ($fresh, &$queued): void {
                    foreach ($chunk as $subscriber) {
                        // Try to create a delivery row; unique(newsletterId,email) guards duplicates.
                        try {
                            $delivery = NewsletterDelivery::create([
                                'newsletterId' => $fresh->id,
                                'subscriberId' => $subscriber->id,
                                'email' => $subscriber->email,
                                'status' => NewsletterDelivery::STATUS_QUEUED,
                            ]);
                        } catch (\Throwable $e) {
                            // Duplicate (already queued earlier) — skip.
                            continue;
                        }

                        SendNewsletterDeliveryJob::dispatch($delivery->id)->onQueue('newsletters');
                        $queued++;
                    }
                }, 'id');

            $fresh->recipientCount = $queued;
            $fresh->save();

            return ['queued' => $queued, 'newsletter' => $fresh];
        });
    }

    /** Send one delivery row via Resend and update tracking. */
    public function sendDelivery(NewsletterDelivery $delivery): void
    {
        $delivery->refresh();

        if ($delivery->status !== NewsletterDelivery::STATUS_QUEUED) {
            return; // already processed
        }

        $newsletter = $delivery->newsletter;
        if (! $newsletter) {
            $delivery->status = NewsletterDelivery::STATUS_FAILED;
            $delivery->failureReason = 'Newsletter missing';
            $delivery->save();
            return;
        }

        // Final suppression check — may have unsubscribed since dispatch.
        $subscriber = NewsletterSubscriber::query()->where('email', $delivery->email)->first();
        if ($subscriber && $subscriber->isUnsubscribed()) {
            $delivery->status = NewsletterDelivery::STATUS_SKIPPED;
            $delivery->save();
            return;
        }

        $frontend = rtrim((string) (env('FRONTEND_URL') ?? env('APP_URL') ?? 'http://localhost:3000'), '/');
        $unsubUrl = $subscriber
            ? $frontend . '/newsletters/unsubscribe/' . $subscriber->unsubscribeToken
            : $frontend . '/newsletters/unsubscribe';

        $html = $this->wrapCampaignHtml($newsletter, $unsubUrl);
        $text = $newsletter->contentText ?: strip_tags($newsletter->contentHtml);
        $text .= "\n\nUnsubscribe: " . $unsubUrl;

        try {
            $result = $this->mail->send(
                to: $delivery->email,
                subject: $newsletter->subject,
                html: $html,
                text: $text,
                headers: [
                    'List-Unsubscribe' => '<' . $unsubUrl . '>',
                    'List-Unsubscribe-Post' => 'List-Unsubscribe=One-Click',
                ],
            );

            $delivery->status = NewsletterDelivery::STATUS_SENT;
            $delivery->sentAt = Carbon::now();
            $delivery->providerMessageId = $result['id'] ?? null;
            $delivery->attempts = $delivery->attempts + 1;
            $delivery->save();

            DB::table('Newsletter')
                ->where('id', $newsletter->id)
                ->increment('acceptedCount');
        } catch (\Throwable $e) {
            $delivery->status = NewsletterDelivery::STATUS_FAILED;
            $delivery->failureReason = substr($e->getMessage(), 0, 1024);
            $delivery->attempts = $delivery->attempts + 1;
            $delivery->save();

            DB::table('Newsletter')
                ->where('id', $newsletter->id)
                ->increment('failedCount');

            Log::warning('newsletter.delivery.failed', [
                'delivery_id' => $delivery->id,
                'newsletter_id' => $newsletter->id,
            ]);
            throw $e; // let the queue retry policy decide
        }
    }

    /**
     * Called when the campaign row's queued set may be fully processed —
     * safe to call repeatedly; it only transitions when there is no remaining work.
     */
    public function finalizeIfComplete(Newsletter $newsletter): void
    {
        $remaining = NewsletterDelivery::query()
            ->where('newsletterId', $newsletter->id)
            ->where('status', NewsletterDelivery::STATUS_QUEUED)
            ->count();

        if ($remaining > 0) {
            return;
        }

        $failed = NewsletterDelivery::query()
            ->where('newsletterId', $newsletter->id)
            ->where('status', NewsletterDelivery::STATUS_FAILED)
            ->count();

        $sent = NewsletterDelivery::query()
            ->where('newsletterId', $newsletter->id)
            ->whereIn('status', [NewsletterDelivery::STATUS_SENT, NewsletterDelivery::STATUS_DELIVERED])
            ->count();

        $newsletter->refresh();
        $newsletter->status = match (true) {
            $sent === 0 && $failed > 0 => Newsletter::STATUS_FAILED,
            $failed > 0 => Newsletter::STATUS_PARTIALLY_FAILED,
            default => Newsletter::STATUS_SENT,
        };
        $newsletter->completedAt = Carbon::now();
        $newsletter->save();
    }

    /** Build a safe, branded wrapper around the newsletter HTML. */
    private function wrapCampaignHtml(Newsletter $newsletter, string $unsubscribeUrl): string
    {
        $primary = '#035CB3';
        $preview = htmlspecialchars((string) ($newsletter->previewText ?? ''), ENT_QUOTES);
        $previewBlock = $preview !== ''
            ? '<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">' . $preview . '</div>'
            : '';
        $body = $newsletter->contentHtml;
        $year = date('Y');

        return <<<HTML
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IES Newsletter</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a">
{$previewBlock}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 0">
  <tr><td align="center">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 6px rgba(15,23,42,0.08)">
      <tr><td style="background:{$primary};padding:20px 24px;color:#ffffff;font-weight:bold;font-size:18px">Institution of Engineers Somalia (IES)</td></tr>
      <tr><td style="padding:24px;font-size:15px;line-height:1.6">{$body}</td></tr>
      <tr><td style="padding:16px 24px;background:#f1f5f9;color:#475569;font-size:12px;line-height:1.5">
        You received this because you subscribed to IES updates.<br>
        <a href="{$unsubscribeUrl}" style="color:{$primary}">Unsubscribe</a> &nbsp;|&nbsp; &copy; {$year} IES
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
HTML;
    }
}
