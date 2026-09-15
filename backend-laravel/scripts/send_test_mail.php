<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$recipient = env('SMTP_USER');

Illuminate\Support\Facades\Mail::mailer('smtp')
    ->to($recipient)
    ->send(new App\Mail\MembershipNotificationMail(
        'IES SMTP Test',
        '<p>SMTP send test completed successfully.</p>',
        "SMTP send test completed successfully.\n"
    ));

echo "send-ok\n";
