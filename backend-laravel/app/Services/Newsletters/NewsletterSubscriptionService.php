<?php

namespace App\Services\Newsletters;

use App\Models\NewsletterSubscriber;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class NewsletterSubscriptionService
{
    public const RESULT_CREATED_PENDING = 'created_pending';
    public const RESULT_RESENT_CONFIRMATION = 'resent_confirmation';
    public const RESULT_ALREADY_SUBSCRIBED = 'already_subscribed';
    public const RESULT_UNSUBSCRIBED_RECONSENT = 'unsubscribed_reconsent';

    public function __construct(
        private readonly ResendMailService $mail,
    ) {}

    /**
     * Idempotent subscribe entry point for the public form.
     *
     * Returns one of the RESULT_* constants together with the subscriber.
     *
     * @return array{result: string, subscriber: NewsletterSubscriber}
     */
    public function subscribe(string $email, ?string $ip = null, ?string $userAgent = null, ?string $source = null): array
    {
        $email = NewsletterSubscriber::normalizeEmail($email);

        return DB::transaction(function () use ($email, $ip, $userAgent, $source) {
            // Row lock so concurrent requests from the same email cannot double-insert.
            $subscriber = NewsletterSubscriber::query()
                ->where('email', $email)
                ->lockForUpdate()
                ->first();

            if ($subscriber === null) {
                $subscriber = NewsletterSubscriber::create([
                    'email' => $email,
                    'status' => NewsletterSubscriber::STATUS_PENDING,
                    'confirmToken' => NewsletterSubscriber::generateToken(),
                    'confirmTokenExpiresAt' => Carbon::now()->addDays(7),
                    'unsubscribeToken' => NewsletterSubscriber::generateToken(),
                    'ipAddress' => $ip,
                    'userAgent' => $userAgent !== null ? substr($userAgent, 0, 512) : null,
                    'source' => $source,
                ]);

                $this->sendConfirmationEmail($subscriber);
                return ['result' => self::RESULT_CREATED_PENDING, 'subscriber' => $subscriber];
            }

            if ($subscriber->status === NewsletterSubscriber::STATUS_SUBSCRIBED) {
                return ['result' => self::RESULT_ALREADY_SUBSCRIBED, 'subscriber' => $subscriber];
            }

            // Pending OR previously unsubscribed: require fresh explicit consent.
            $subscriber->status = NewsletterSubscriber::STATUS_PENDING;
            $subscriber->confirmToken = NewsletterSubscriber::generateToken();
            $subscriber->confirmTokenExpiresAt = Carbon::now()->addDays(7);
            if (! $subscriber->unsubscribeToken) {
                $subscriber->unsubscribeToken = NewsletterSubscriber::generateToken();
            }
            $subscriber->emailVerifiedAt = null;
            $subscriber->unsubscribedAt = null;
            $wasUnsubscribed = ($subscriber->getOriginal('status') === NewsletterSubscriber::STATUS_UNSUBSCRIBED);
            $subscriber->save();

            $this->sendConfirmationEmail($subscriber);

            return [
                'result' => $wasUnsubscribed ? self::RESULT_UNSUBSCRIBED_RECONSENT : self::RESULT_RESENT_CONFIRMATION,
                'subscriber' => $subscriber,
            ];
        });
    }

    public function confirm(string $token): ?NewsletterSubscriber
    {
        if (strlen($token) < 32) {
            return null;
        }

        return DB::transaction(function () use ($token) {
            $subscriber = NewsletterSubscriber::query()
                ->where('confirmToken', $token)
                ->lockForUpdate()
                ->first();

            if (! $subscriber) {
                return null;
            }

            if ($subscriber->confirmTokenExpiresAt && Carbon::parse($subscriber->confirmTokenExpiresAt)->isPast()) {
                return null;
            }

            $subscriber->status = NewsletterSubscriber::STATUS_SUBSCRIBED;
            $subscriber->emailVerifiedAt = Carbon::now();
            $subscriber->confirmToken = null;
            $subscriber->confirmTokenExpiresAt = null;
            $subscriber->save();

            return $subscriber;
        });
    }

    public function unsubscribeByToken(string $token): ?NewsletterSubscriber
    {
        if (strlen($token) < 32) {
            return null;
        }

        return DB::transaction(function () use ($token) {
            $subscriber = NewsletterSubscriber::query()
                ->where('unsubscribeToken', $token)
                ->lockForUpdate()
                ->first();

            if (! $subscriber) {
                return null;
            }

            if ($subscriber->status === NewsletterSubscriber::STATUS_UNSUBSCRIBED) {
                return $subscriber;
            }

            $subscriber->status = NewsletterSubscriber::STATUS_UNSUBSCRIBED;
            $subscriber->unsubscribedAt = Carbon::now();
            $subscriber->save();

            return $subscriber;
        });
    }

    public function suppressByEmail(string $email): void
    {
        $email = NewsletterSubscriber::normalizeEmail($email);
        NewsletterSubscriber::query()
            ->where('email', $email)
            ->update([
                'status' => NewsletterSubscriber::STATUS_SUPPRESSED,
                'unsubscribedAt' => Carbon::now(),
                'updatedAt' => Carbon::now(),
            ]);
    }

    private function sendConfirmationEmail(NewsletterSubscriber $subscriber): void
    {
        $frontend = rtrim((string) (env('FRONTEND_URL') ?? env('APP_URL') ?? 'http://localhost:3000'), '/');
        $confirmUrl = $frontend . '/newsletters/confirm/' . $subscriber->confirmToken;
        $unsubscribeUrl = $frontend . '/newsletters/unsubscribe/' . $subscriber->unsubscribeToken;

        try {
            $view = view('emails.newsletter-confirm', [
                'confirmUrl' => $confirmUrl,
                'unsubscribeUrl' => $unsubscribeUrl,
                'email' => $subscriber->email,
            ])->render();
        } catch (\Throwable $e) {
            // Fallback: a minimal inline HTML if the view ever fails to resolve.
            $view = $this->fallbackConfirmHtml($confirmUrl, $unsubscribeUrl);
        }

        $text = "Please confirm your newsletter subscription:\n\n" . $confirmUrl
            . "\n\nIf you did not request this, you can ignore this email or unsubscribe here:\n" . $unsubscribeUrl;

        try {
            $this->mail->send(
                to: $subscriber->email,
                subject: 'Confirm your IES newsletter subscription',
                html: $view,
                text: $text,
                headers: [
                    'List-Unsubscribe' => '<' . $unsubscribeUrl . '>',
                    'List-Unsubscribe-Post' => 'List-Unsubscribe=One-Click',
                ],
            );
        } catch (\Throwable $e) {
            // Do not expose provider errors to the HTTP caller — the public endpoint
            // reports a generic success. We log for ops and let the user re-trigger.
            Log::warning('newsletter.confirmation.send_failed', [
                'subscriber_id' => $subscriber->id,
                'error' => Str::limit($e->getMessage(), 300),
            ]);
        }
    }

    private function fallbackConfirmHtml(string $confirmUrl, string $unsubscribeUrl): string
    {
        $primary = '#035CB3';
        return <<<HTML
<!doctype html><html><body style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;max-width:600px;margin:0 auto;padding:24px">
<h1 style="color:{$primary};font-size:20px">Confirm your subscription</h1>
<p>Please confirm you want to receive the IES newsletter.</p>
<p><a href="{$confirmUrl}" style="display:inline-block;background:{$primary};color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Confirm subscription</a></p>
<p style="font-size:12px;color:#64748b">If you did not request this, you can <a href="{$unsubscribeUrl}">unsubscribe</a>.</p>
</body></html>
HTML;
    }
}
