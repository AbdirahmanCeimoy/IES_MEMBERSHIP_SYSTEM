<?php

namespace App\Services\Auth;

use App\Exceptions\NestHttpException;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Throwable;

class JwtTokenService
{
    public function issue(User $user): string
    {
        $secret = $this->secret();
        $issuedAt = time();
        $expiresInSeconds = $this->expiresInSeconds();

        return JWT::encode([
            'sub' => $user->id,
            'username' => $user->username,
            'role' => $user->role->value,
            'iat' => $issuedAt,
            'exp' => $issuedAt + $expiresInSeconds,
        ], $secret, 'HS256');
    }

    public function verify(string $token): array
    {
        try {
            $payload = (array) JWT::decode($token, new Key($this->secret(), 'HS256'));

            if (isset($payload['role']) && is_string($payload['role'])) {
                $payload['role'] = strtoupper(trim($payload['role']));
            }

            return $payload;
        } catch (Throwable) {
            throw NestHttpException::unauthorized('Invalid token');
        }
    }

    private function secret(): string
    {
        $secret = trim((string) env('JWT_SECRET', ''));

        if ($secret === '') {
            throw new \RuntimeException('JWT_SECRET must be configured.');
        }

        if (strlen($secret) < 32) {
            throw new \RuntimeException(
                'JWT_SECRET must be at least 32 characters long.'
            );
        }

        return $secret;
    }

    private function expiresInSeconds(): int
    {
        $raw = trim((string) env('JWT_EXPIRES_IN', '1d'));

        if ($raw !== '' && ctype_digit($raw)) {
            return (int) $raw;
        }

        if (preg_match('/^(\d+)([smhd])$/', $raw, $matches) !== 1) {
            throw new \RuntimeException('JWT_EXPIRES_IN must be a number or use s/m/h/d suffix.');
        }

        $value = (int) $matches[1];

        return match ($matches[2]) {
            's' => $value,
            'm' => $value * 60,
            'h' => $value * 3600,
            'd' => $value * 86400,
        };
    }
}
