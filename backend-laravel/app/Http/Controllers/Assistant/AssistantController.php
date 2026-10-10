<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Services\Assistant\IesAssistantService;
use App\Services\Assistant\MockAssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AssistantController extends Controller
{
    public function __construct(
        private readonly IesAssistantService $assistant,
        private readonly MockAssistantService $mock,
    ) {}

    private function usingMock(): bool
    {
        return ! (bool) config('assistant.openai.key');
    }

    /**
     * Public endpoint — anyone can ask. Rate-limited per IP.
     *
     * POST /api/assistant/chat
     * Body: { message: string, history?: [{role: 'user'|'assistant', content: string}] }
     */
    public function chat(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1500'],
            'history' => ['nullable', 'array', 'max:16'],
            'history.*.role' => ['required_with:history', 'string', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:4000'],
        ]);

        $ip = (string) $request->ip();
        $key = 'assistant:chat:' . $ip;

        // 15 questions per IP per minute, 150 per hour. Prevents casual abuse
        // without blocking legitimate conversations.
        if (RateLimiter::tooManyAttempts($key, 15) || RateLimiter::tooManyAttempts($key . ':h', 150)) {
            return response()->json([
                'success' => false,
                'reply' => "You're sending questions a bit fast — please wait a moment and try again.",
            ], 429);
        }
        RateLimiter::hit($key, 60);
        RateLimiter::hit($key . ':h', 3600);

        try {
            $result = $this->usingMock()
                ? $this->mock->respond((string) $data['message'], $data['history'] ?? [])
                : $this->assistant->respond((string) $data['message'], $data['history'] ?? []);
        } catch (\Throwable $e) {
            report($e);
            // Final fallback — if OpenAI is configured but the request died,
            // serve a knowledge-grounded answer rather than a dead end.
            try {
                $result = $this->mock->respond((string) $data['message'], $data['history'] ?? []);
            } catch (\Throwable $e2) {
                return response()->json([
                    'success' => false,
                    'reply' => 'Sorry, I ran into a problem answering that. Please try again in a moment, or contact info@iesomalia.org.so for help.',
                ], 503);
            }
        }

        return response()->json([
            'success' => true,
            'reply' => $result['reply'],
            'sources' => $result['sources'],
            'model' => $result['model'],
        ]);
    }

    public function health(): JsonResponse
    {
        $configured = (bool) config('assistant.openai.key');
        return response()->json([
            'ok' => true,
            'configured' => $configured,
            'mode' => $configured ? 'openai' : 'mock',
            'model' => $configured ? (config('assistant.openai.model') ?: 'gpt-4o-mini') : 'ies-knowledge-base',
        ]);
    }
}
