<?php

$ehloDomain = trim((string) env('MAIL_EHLO_DOMAIN', ''));
$appHost = parse_url((string) env('APP_URL', 'http://localhost'), PHP_URL_HOST);

return [
    'default' => env('MAIL_MAILER', 'smtp'),

    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('SMTP_HOST', '127.0.0.1'),
            'port' => (int) env('SMTP_PORT', 587),
            'encryption' => env(
                'SMTP_ENCRYPTION',
                (int) env('SMTP_PORT', 587) === 465
                    ? 'ssl'
                    : ((env('SMTP_SECURE', false) === 'true' || (int) env('SMTP_PORT', 587) === 587) ? 'tls' : null)
            ),
            'username' => env('SMTP_USER'),
            'password' => env('SMTP_PASS'),
            'timeout' => max(1, (int) ceil(((int) env('SMTP_CONNECTION_TIMEOUT_MS', 10000)) / 1000)),
            'local_domain' => $ehloDomain !== '' ? $ehloDomain : ($appHost ?: 'localhost.localdomain'),
            'stream' => [
                'ssl' => [
                    'allow_self_signed' => env('SMTP_ALLOW_SELF_SIGNED', false) === 'true',
                    'verify_peer' => env('SMTP_ALLOW_SELF_SIGNED', false) !== 'true',
                    'verify_peer_name' => env('SMTP_ALLOW_SELF_SIGNED', false) !== 'true',
                ],
            ],
        ],
    ],

    'from' => [
        'address' => env('SMTP_USER', 'hello@example.com'),
        'name' => env('APP_NAME', 'IES'),
    ],
];
