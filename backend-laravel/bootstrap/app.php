<?php

use App\Exceptions\NestHttpException;
use App\Http\Middleware\ApiRateLimitMiddleware;
use App\Http\Middleware\JwtAuthMiddleware;
use App\Http\Middleware\RequestLoggingMiddleware;
use App\Http\Middleware\RequireRoleMiddleware;
use App\Http\Middleware\SecurityHeadersMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up'
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(SecurityHeadersMiddleware::class);

        $middleware->api(prepend: [
            ApiRateLimitMiddleware::class,
            RequestLoggingMiddleware::class,
        ]);

        $middleware->alias([
            'jwt.auth' => JwtAuthMiddleware::class,
            'role' => RequireRoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (NestHttpException $exception, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            return response()->json($exception->toArray(), $exception->status());
        });

        $exceptions->render(function (HttpExceptionInterface $exception, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            $status = $exception->getStatusCode();
            $labels = [
                400 => 'Bad Request',
                401 => 'Unauthorized',
                403 => 'Forbidden',
                404 => 'Not Found',
                405 => 'Method Not Allowed',
                422 => 'Unprocessable Entity',
                429 => 'Too Many Requests',
                503 => 'Service Unavailable',
            ];

            $message = $exception->getMessage() !== ''
                ? $exception->getMessage()
                : ($status >= 500 ? 'Internal server error' : 'HTTP error');

            if ($status === 404) {
                $message = sprintf(
                    'Cannot %s %s',
                    strtoupper($request->method()),
                    $request->getPathInfo()
                );
            }

            $payload = [
                'statusCode' => $status,
                'message' => $message,
            ];

            if ($status < 500 && isset($labels[$status])) {
                $payload['error'] = $labels[$status];
            }

            return response()->json($payload, $status);
        });

        $exceptions->render(function (Throwable $exception, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            return response()->json([
                'statusCode' => 500,
                'message' => 'Internal server error',
            ], 500);
        });
    })
    ->create();
