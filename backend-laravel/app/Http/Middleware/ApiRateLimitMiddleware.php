<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class ApiRateLimitMiddleware
{
    private const DEFAULT_WINDOW_MS = 60000;

    private const DEFAULT_MAX_REQUESTS = 120;

    public function handle(Request $request, Closure $next): Response
    {
        if ($this->shouldBypassRateLimit($request)) {
            return $next($request);
        }

        $windowMs = $this->parsePositiveInt($this->env('RATE_LIMIT_WINDOW_MS', (string) self::DEFAULT_WINDOW_MS), self::DEFAULT_WINDOW_MS);
        $maxRequests = $this->parsePositiveInt($this->env('RATE_LIMIT_MAX_REQUESTS', (string) self::DEFAULT_MAX_REQUESTS), self::DEFAULT_MAX_REQUESTS);
        $segment = str_starts_with($request->path(), 'api/auth') ? 'auth' : 'global';
        $segmentLimit = $segment === 'auth' ? max(10, (int) floor($maxRequests / 2)) : $maxRequests;
        $cacheKey = 'rate-limit:' . md5($this->resolveClientIp($request) . ':' . $segment);
        $nowMs = (int) floor(microtime(true) * 1000);

        /** @var array{count:int,resetAt:int}|null $bucket */
        $bucket = Cache::get($cacheKey);

        if (! is_array($bucket) || ($bucket['resetAt'] ?? 0) <= $nowMs) {
            Cache::put($cacheKey, [
                'count' => 1,
                'resetAt' => $nowMs + $windowMs,
            ], (int) ceil($windowMs / 1000));

            return $next($request);
        }

        if (($bucket['count'] ?? 0) >= $segmentLimit) {
            $retryAfter = max(1, (int) ceil(($bucket['resetAt'] - $nowMs) / 1000));

            return new JsonResponse([
                'statusCode' => 429,
                'message' => 'Too many requests. Please try again shortly.',
            ], 429, [
                'Retry-After' => (string) $retryAfter,
            ]);
        }

        $bucket['count'] += 1;
        Cache::put(
            $cacheKey,
            $bucket,
            max(1, (int) ceil(($bucket['resetAt'] - $nowMs) / 1000))
        );

        return $next($request);
    }

    private function shouldBypassRateLimit(Request $request): bool
    {
        return $request->isMethod('OPTIONS') || str_starts_with($request->path(), 'api/health');
    }

    private function resolveClientIp(Request $request): string
    {
        return $request->ip() ?: 'unknown';
    }

    private function parsePositiveInt(string $value, int $fallback): int
    {
        if (! preg_match('/^\d+$/', $value)) {
            return $fallback;
        }

        $parsed = (int) $value;

        return $parsed > 0 ? $parsed : $fallback;
    }

    private function env(string $key, string $default = ''): string
    {
        $value = getenv($key);

        if ($value !== false) {
            return (string) $value;
        }

        if (app()->environment('testing')) {
            return $default;
        }

        if (array_key_exists($key, $_ENV)) {
            return (string) $_ENV[$key];
        }

        if (array_key_exists($key, $_SERVER)) {
            return (string) $_SERVER[$key];
        }

        return $default;
    }
}
