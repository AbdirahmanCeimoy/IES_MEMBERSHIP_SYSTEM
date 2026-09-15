<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$mail = new App\Mail\MembershipNotificationMail(
    'IES Test Mail',
    '<p>Mail render check.</p>',
    "Mail render check.\n"
);

$mail->render();

echo "render-ok\n";
