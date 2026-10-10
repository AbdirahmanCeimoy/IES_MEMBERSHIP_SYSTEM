<?php

return [
    'resend' => [
        'key' => env('RESEND_API_KEY'),
        'from' => env('RESEND_FROM'),
        'reply_to' => env('RESEND_REPLY_TO'),
        'webhook_secret' => env('RESEND_WEBHOOK_SECRET'),
    ],
    'frontend_url' => env('FRONTEND_URL', env('APP_URL')),
    'queue' => [
        'name' => env('NEWSLETTER_QUEUE', 'newsletters'),
    ],
];
