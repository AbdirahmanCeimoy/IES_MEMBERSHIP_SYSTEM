<?php

namespace App\Http\Middleware;

use App\Exceptions\NestHttpException;
use App\Models\User;
use App\Services\Auth\JwtTokenService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthMiddleware
{
    public function __construct(
        private readonly JwtTokenService $jwtTokenService
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');

        if (! is_string($authHeader) || ! str_starts_with($authHeader, 'Bearer ')) {
            throw NestHttpException::unauthorized('Missing Bearer token');
        }

        $token = substr($authHeader, 7);
        $payload = $this->jwtTokenService->verify($token);

        if (! User::query()->where('id', $payload['sub'] ?? null)->exists()) {
            throw NestHttpException::unauthorized('User not found');
        }

        $request->attributes->set('auth', $payload);

        return $next($request);
    }
}
