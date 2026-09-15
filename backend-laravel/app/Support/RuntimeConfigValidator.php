<?php

namespace App\Support;

use RuntimeException;

class RuntimeConfigValidator
{
    private const LOCAL_DEV_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ];

    public function validate(): void
    {
        if (app()->environment('testing') || env('APP_SKIP_RUNTIME_VALIDATION', false) === 'true') {
            return;
        }

        $this->validateApplicationSettings();
        $this->validateJwtSecret();
        $this->validateDatabase();
        $this->validateDocumentStorage();
        $this->validateCorsOrigins();
        $this->validateSmtp();
    }

    private function validateApplicationSettings(): void
    {
        $appKey = trim((string) env('APP_KEY', ''));

        if (app()->environment('production') && $appKey === '') {
            throw new RuntimeException('APP_KEY must be set.');
        }

        if (! app()->environment('production')) {
            return;
        }

        $appUrl = trim((string) env('APP_URL', ''));

        if ($appUrl === '' || filter_var($appUrl, FILTER_VALIDATE_URL) === false) {
            throw new RuntimeException('APP_URL must be a valid URL in production.');
        }

        $scheme = strtolower((string) parse_url($appUrl, PHP_URL_SCHEME));
        $host = strtolower((string) parse_url($appUrl, PHP_URL_HOST));

        if ($scheme !== 'https') {
            throw new RuntimeException('APP_URL must use https in production.');
        }

        if ($host === '' || in_array($host, ['localhost', '127.0.0.1'], true)) {
            throw new RuntimeException('APP_URL must point to the live host in production.');
        }

        if ((bool) env('APP_DEBUG', false)) {
            throw new RuntimeException('APP_DEBUG must be false in production.');
        }
    }

    private function validateJwtSecret(): void
    {
        $jwtSecret = trim((string) env('JWT_SECRET', ''));

        if ($jwtSecret === '') {
            throw new RuntimeException('JWT_SECRET must be set.');
        }

        if (mb_strlen($jwtSecret) < 32) {
            throw new RuntimeException('JWT_SECRET must be at least 32 characters long.');
        }
    }

    private function validateDatabase(): void
    {
        $connection = trim((string) env('DB_CONNECTION', ''));

        if ($connection === '') {
            throw new RuntimeException('DB_CONNECTION must be set.');
        }

        if (app()->environment('production') && $connection === 'sqlite') {
            throw new RuntimeException('SQLite is not supported in production.');
        }

        if ($connection === 'mysql') {
            $required = [
                'DB_HOST' => trim((string) env('DB_HOST', '')),
                'DB_PORT' => trim((string) env('DB_PORT', '')),
                'DB_DATABASE' => trim((string) env('DB_DATABASE', '')),
                'DB_USERNAME' => trim((string) env('DB_USERNAME', '')),
            ];

            $missing = array_keys(array_filter($required, static fn (string $value): bool => $value === ''));

            if ($missing !== []) {
                throw new RuntimeException('Missing MySQL settings: ' . implode(', ', $missing) . '.');
            }

            $port = $this->parsePort($required['DB_PORT'], 'DB_PORT');
            if ($port <= 0 || $port > 65535) {
                throw new RuntimeException('DB_PORT must be a valid TCP port number.');
            }
        }
    }

    private function validateCorsOrigins(): void
    {
        $raw = trim((string) env('CORS_ORIGINS', ''));

        if ($raw === '') {
            if (app()->environment('production')) {
                throw new RuntimeException('CORS_ORIGINS is required in production.');
            }

            return;
        }

        $origins = array_values(array_filter(array_map(
            static fn (string $origin): string => trim($origin),
            explode(',', $raw)
        )));

        if ($origins === []) {
            throw new RuntimeException('CORS_ORIGINS must contain at least one origin.');
        }

        if (app()->environment('production')) {
            foreach ($origins as $origin) {
                if (filter_var($origin, FILTER_VALIDATE_URL) === false) {
                    throw new RuntimeException('Each CORS origin must be a valid URL.');
                }

                $scheme = strtolower((string) parse_url($origin, PHP_URL_SCHEME));
                $host = strtolower((string) parse_url($origin, PHP_URL_HOST));

                if ($scheme !== 'https') {
                    throw new RuntimeException('CORS_ORIGINS must use https in production.');
                }

                if ($host === '' || in_array($host, ['localhost', '127.0.0.1'], true)) {
                    throw new RuntimeException('CORS_ORIGINS must not contain local hosts in production.');
                }
            }

            return;
        }

        $missingLocalOrigin = array_diff(self::LOCAL_DEV_ORIGINS, $origins);

        if (count($missingLocalOrigin) === count(self::LOCAL_DEV_ORIGINS)) {
            return;
        }
    }

    private function validateDocumentStorage(): void
    {
        if (! app()->environment('production')) {
            return;
        }

        $root = trim((string) env('MEMBERSHIP_DOCUMENTS_ROOT', ''));

        if ($root === '') {
            throw new RuntimeException('MEMBERSHIP_DOCUMENTS_ROOT must be set in production.');
        }

        if (! $this->isAbsolutePath($root)) {
            throw new RuntimeException('MEMBERSHIP_DOCUMENTS_ROOT must be an absolute path in production.');
        }

        $normalizedRoot = $this->normalizePath($root);
        $normalizedBasePath = $this->normalizePath(base_path());

        if ($normalizedRoot === $normalizedBasePath || str_starts_with($normalizedRoot, $normalizedBasePath . '/')) {
            throw new RuntimeException(
                'MEMBERSHIP_DOCUMENTS_ROOT must point to a persistent path outside the app release directory.'
            );
        }
    }

    private function validateSmtp(): void
    {
        $smtpHost = trim((string) env('SMTP_HOST', ''));
        $smtpPortRaw = trim((string) env('SMTP_PORT', ''));
        $smtpUser = trim((string) env('SMTP_USER', ''));
        $smtpPass = trim((string) preg_replace('/\s+/', '', (string) env('SMTP_PASS', '')));
        $smtpFrom = trim((string) env('SMTP_FROM', ''));
        $smtpAllowSelfSigned = env('SMTP_ALLOW_SELF_SIGNED', false) === 'true';
        $mailEhloDomain = trim((string) env('MAIL_EHLO_DOMAIN', ''));

        $missing = array_keys(array_filter([
            'SMTP_HOST' => $smtpHost,
            'SMTP_PORT' => $smtpPortRaw,
            'SMTP_USER' => $smtpUser,
            'SMTP_PASS' => $smtpPass,
            'SMTP_FROM' => $smtpFrom,
        ], static fn (string $value): bool => $value === ''));

        if ($missing !== []) {
            throw new RuntimeException(
                'Real email delivery is required. Missing SMTP settings: ' . implode(', ', $missing) . '.'
            );
        }

        $port = $this->parsePort($smtpPortRaw, 'SMTP_PORT');
        if ($port <= 0 || $port > 65535) {
            throw new RuntimeException('SMTP_PORT must be a valid TCP port number.');
        }

        if (app()->environment('production') && $smtpAllowSelfSigned) {
            throw new RuntimeException('SMTP_ALLOW_SELF_SIGNED must be false in production.');
        }

        if (app()->environment('production') && $mailEhloDomain === '') {
            throw new RuntimeException('MAIL_EHLO_DOMAIN must be set in production.');
        }
    }

    private function parsePort(string $value, string $field): int
    {
        if (! preg_match('/^\d+$/', $value)) {
            throw new RuntimeException("{$field} must be a valid TCP port number.");
        }

        return (int) $value;
    }

    private function isAbsolutePath(string $path): bool
    {
        return preg_match('/^(?:[A-Za-z]:[\\\\\\/]|\/)/', $path) === 1;
    }

    private function normalizePath(string $path): string
    {
        return rtrim(str_replace('\\', '/', trim($path)), '/');
    }
}
