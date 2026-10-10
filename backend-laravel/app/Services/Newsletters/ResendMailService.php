<?php

namespace App\Services\Newsletters;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Thin, server-side wrapper around the Resend REST API.
 *
 * Only knows how to send a single email. Delivery state is driven by
 * the application layer (NewsletterCampaignService + webhook).
 */
class ResendMailService
{
    private const ENDPOINT = 'https://api.resend.com/emails';

    public function __construct(
        private readonly ?string $apiKey = null,
        private readonly ?string $fromAddress = null,
        private readonly ?string $replyTo = null,
    ) {}

    private function apiKey(): string
    {
        $key = $this->apiKey ?? config('newsletter.resend.key') ?? env('RESEND_API_KEY');
        if (! $key || ! is_string($key)) {
            throw new RuntimeException('RESEND_API_KEY is not configured.');
        }
        return $key;
    }

    private function from(): string
    {
        $from = $this->fromAddress ?? config('newsletter.resend.from') ?? env('RESEND_FROM');
        if (! $from || ! is_string($from)) {
            throw new RuntimeException('RESEND_FROM is not configured.');
        }
        return $from;
    }

    /**
     * Send a transactional or campaign email.
     *
     * @param  array<int, string>|string  $to
     * @param  array<string, string>  $headers
     * @return array{id: string}
     */
    public function send(
        array|string $to,
        string $subject,
        string $html,
        ?string $text = null,
        array $headers = [],
    ): array {
        $payload = [
            'from' => $this->from(),
            'to' => is_array($to) ? array_values($to) : [$to],
            'subject' => $subject,
            'html' => $html,
        ];

        if ($text !== null && $text !== '') {
            $payload['text'] = $text;
        }

        $replyTo = $this->replyTo ?? config('newsletter.resend.reply_to') ?? env('RESEND_REPLY_TO');
        if ($replyTo) {
            $payload['reply_to'] = $replyTo;
        }

        if (! empty($headers)) {
            $payload['headers'] = $headers;
        }

        $response = Http::withToken($this->apiKey())
            ->acceptJson()
            ->asJson()
            ->timeout(15)
            ->retry(2, 400, throw: false)
            ->post(self::ENDPOINT, $payload);

        if ($response->failed()) {
            // Log without PII or the key.
            Log::warning('resend.send.failed', [
                'status' => $response->status(),
                'to_count' => is_array($to) ? count($to) : 1,
                'subject' => $subject,
            ]);
            $body = $response->json();
            $message = is_array($body) && isset($body['message'])
                ? (string) $body['message']
                : 'Resend API request failed.';
            throw new RuntimeException($message, $response->status());
        }

        $data = $response->json();
        $id = is_array($data) && isset($data['id']) ? (string) $data['id'] : '';

        return ['id' => $id];
    }
}
