<?php

namespace App\Http\Controllers\Newsletters;

use App\Http\Controllers\Controller;
use App\Services\Newsletters\NewsletterSubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

/**
 * Public newsletter endpoints: subscribe / confirm / unsubscribe / status.
 *
 * These are deliberately not JWT-protected and respond with the same shape
 * for enumeration-resistance: the caller cannot tell whether an email is
 * already registered or not.
 */
class SubscriptionsController extends Controller
{
    private const SUCCESS_MESSAGE = 'Thanks for subscribing! Please check your inbox for confirmation.';
    private const DUPLICATE_MESSAGE = 'This email is already subscribed.';
    private const GENERIC_ERROR = 'Unable to subscribe right now. Please try again.';

    public function __construct(
        private readonly NewsletterSubscriptionService $service,
    ) {}

    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email:rfc', 'max:255'],
            'source' => ['nullable', 'string', 'max:64'],
        ], [
            'email.required' => 'Please enter a valid email address.',
            'email.email' => 'Please enter a valid email address.',
        ]);

        // Per-IP + per-email throttling. Separate from Laravel's global API limiter
        // so this public endpoint does not get free quota.
        $ip = (string) $request->ip();
        $email = strtolower((string) $data['email']);
        $byIp = 'nl:sub:ip:' . $ip;
        $byEmail = 'nl:sub:email:' . sha1($email);

        if (RateLimiter::tooManyAttempts($byIp, 10) || RateLimiter::tooManyAttempts($byEmail, 3)) {
            return response()->json([
                'success' => false,
                'message' => self::GENERIC_ERROR,
            ], 429);
        }
        RateLimiter::hit($byIp, 60);        // 10 subscriptions per IP per minute
        RateLimiter::hit($byEmail, 600);    // 3 attempts per email per 10 minutes

        try {
            $outcome = $this->service->subscribe(
                email: $email,
                ip: $ip,
                userAgent: (string) $request->userAgent(),
                source: $data['source'] ?? 'footer',
            );
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => self::GENERIC_ERROR,
            ], 500);
        }

        $message = match ($outcome['result']) {
            NewsletterSubscriptionService::RESULT_ALREADY_SUBSCRIBED => self::DUPLICATE_MESSAGE,
            default => self::SUCCESS_MESSAGE,
        };

        return response()->json([
            'success' => true,
            'message' => $message,
        ], 200);
    }

    public function confirm(string $token): JsonResponse
    {
        $subscriber = $this->service->confirm($token);

        if (! $subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'This confirmation link is invalid or has expired.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Your subscription has been confirmed. Welcome!',
            'email' => $subscriber->email,
        ]);
    }

    public function unsubscribe(string $token): JsonResponse
    {
        $subscriber = $this->service->unsubscribeByToken($token);

        if (! $subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'This unsubscribe link is invalid.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'You have been unsubscribed. We won\'t email you anymore.',
            'email' => $subscriber->email,
        ]);
    }
}
