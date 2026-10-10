<?php

namespace App\Http\Controllers\Newsletters;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use App\Models\NewsletterDelivery;
use App\Services\Newsletters\NewsletterSubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Resend webhook receiver. Protected by a shared secret header (not JWT)
 * because Resend signs with a static key per endpoint.
 *
 * Set RESEND_WEBHOOK_SECRET in the environment. The webhook URL is
 * POST /api/newsletters/webhooks/resend?secret=... — or send it via
 * the Svix-Signature header, whichever Resend is configured to use.
 */
class WebhookController extends Controller
{
    public function resend(Request $request): JsonResponse
    {
        $expected = (string) (env('RESEND_WEBHOOK_SECRET') ?? '');
        if ($expected === '') {
            return response()->json(['success' => false], 503);
        }

        $provided = (string) ($request->header('X-Webhook-Secret') ?? $request->query('secret') ?? '');
        if (! hash_equals($expected, $provided)) {
            return response()->json(['success' => false], 401);
        }

        $event = (string) $request->input('type', '');
        $data = (array) $request->input('data', []);
        $messageId = (string) ($data['email_id'] ?? $data['id'] ?? '');
        $to = $data['to'] ?? null;
        $email = is_array($to) ? (string) ($to[0] ?? '') : (string) ($to ?? '');

        if ($messageId === '' && $email === '') {
            return response()->json(['success' => true]);
        }

        $delivery = NewsletterDelivery::query()
            ->when($messageId !== '', fn ($q) => $q->where('providerMessageId', $messageId))
            ->first();

        if (! $delivery && $email !== '') {
            // Fallback: match the most recent delivery for this email.
            $delivery = NewsletterDelivery::query()
                ->where('email', strtolower($email))
                ->orderByDesc('createdAt')
                ->first();
        }

        if (! $delivery) {
            Log::info('resend.webhook.no_match', ['event' => $event, 'messageId' => $messageId]);
            return response()->json(['success' => true]);
        }

        DB::transaction(function () use ($delivery, $event) {
            $newsletterId = $delivery->newsletterId;
            switch ($event) {
                case 'email.delivered':
                    $delivery->status = NewsletterDelivery::STATUS_DELIVERED;
                    $delivery->deliveredAt = Carbon::now();
                    $delivery->save();
                    DB::table('Newsletter')->where('id', $newsletterId)->increment('deliveredCount');
                    break;
                case 'email.bounced':
                case 'email.complained':
                    $delivery->status = NewsletterDelivery::STATUS_BOUNCED;
                    $delivery->bouncedAt = Carbon::now();
                    $delivery->save();
                    DB::table('Newsletter')->where('id', $newsletterId)->increment('bouncedCount');
                    // Suppress the subscriber so future campaigns skip them.
                    app(NewsletterSubscriptionService::class)->suppressByEmail($delivery->email);
                    break;
                case 'email.sent':
                    if ($delivery->status === NewsletterDelivery::STATUS_QUEUED) {
                        $delivery->status = NewsletterDelivery::STATUS_SENT;
                        $delivery->sentAt = Carbon::now();
                        $delivery->save();
                    }
                    break;
                default:
                    // Unknown event — ignore but log.
                    Log::info('resend.webhook.ignored', ['event' => $event]);
                    break;
            }
        });

        return response()->json(['success' => true]);
    }
}
