<?php

namespace App\Services\Assistant;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Server-side OpenAI Chat Completions client.
 *
 * Deliberately uses Laravel's native Http client so no new composer dependency
 * is added. Only exposes a single chat() call — the shape it returns matches
 * the public /api/assistant/chat contract.
 */
class OpenAIService
{
    private const DEFAULT_MODEL = 'gpt-4o-mini';
    private const ENDPOINT = 'https://api.openai.com/v1/chat/completions';

    private function apiKey(): string
    {
        $key = config('assistant.openai.key') ?? env('OPENAI_API_KEY');
        if (! is_string($key) || $key === '') {
            throw new RuntimeException('OPENAI_API_KEY is not configured.');
        }
        return $key;
    }

    private function model(): string
    {
        $m = config('assistant.openai.model') ?? env('OPENAI_MODEL');
        return (is_string($m) && $m !== '') ? $m : self::DEFAULT_MODEL;
    }

    /**
     * @param  list<array{role: string, content: string}>  $messages
     * @return array{reply: string, model: string, usage: array<string, int>}
     */
    public function chat(array $messages, int $maxTokens = 600, float $temperature = 0.3): array
    {
        $payload = [
            'model' => $this->model(),
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
        ];

        $response = Http::withToken($this->apiKey())
            ->acceptJson()
            ->asJson()
            ->timeout(30)
            ->retry(1, 400, throw: false)
            ->post(self::ENDPOINT, $payload);

        if ($response->failed()) {
            // Never log the API key or full user message bodies.
            Log::warning('openai.chat.failed', [
                'status' => $response->status(),
                'message_count' => count($messages),
            ]);
            $body = $response->json();
            $message = is_array($body) && isset($body['error']['message'])
                ? (string) $body['error']['message']
                : 'OpenAI request failed.';
            throw new RuntimeException($message, $response->status());
        }

        $data = $response->json();
        $reply = is_array($data) ? (string) ($data['choices'][0]['message']['content'] ?? '') : '';
        $usage = is_array($data) && isset($data['usage']) ? (array) $data['usage'] : [];

        return [
            'reply' => trim($reply),
            'model' => $this->model(),
            'usage' => $usage,
        ];
    }
}
