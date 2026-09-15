<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RequestLoggingMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = microtime(true);
        $clientIp = $request->ip() ?: 'unknown';

        $response = $next($request);

        $elapsedMs = number_format((microtime(true) - $startedAt) * 1000, 1, '.', '');
        $statusCode = $response->getStatusCode();
        $line = sprintf(
            '%s %s %d %sms ip=%s',
            $request->method(),
            $request->getRequestUri(),
            $statusCode,
            $elapsedMs,
            $clientIp
        );

        if ($statusCode >= 500) {
            Log::error($line);

            return $response;
        }

        if ($statusCode >= 400 || str_starts_with($request->path(), 'api/auth')) {
            Log::warning($line);
        }

        return $response;
    }
}
