<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Symfony\Component\Mime\Email;

class MembershipNotificationMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $mailSubject,
        private readonly string $htmlBody,
        private readonly string $textBody,
        private readonly array $attachmentsData = [],
        private readonly ?array $fromMailbox = null,
        private readonly ?array $replyToMailbox = null,
        private readonly ?string $auditBcc = null,
        private readonly array $headers = []
    ) {
    }

    public function build(): self
    {
        $mail = $this->subject($this->mailSubject)
            ->view('emails.membership-html', [
                'html' => $this->htmlBody,
            ])
            ->text('emails.membership-text', [
                'text' => $this->textBody,
            ]);

        if ($this->fromMailbox !== null) {
            $mail->from($this->fromMailbox['address'], $this->fromMailbox['name'] ?? null);
        }

        if ($this->replyToMailbox !== null) {
            $mail->replyTo($this->replyToMailbox['address'], $this->replyToMailbox['name'] ?? null);
        }

        if ($this->auditBcc !== null) {
            $mail->bcc($this->auditBcc);
        }

        if ($this->headers !== []) {
            $headers = $this->headers;

            $mail->withSymfonyMessage(function (Email $message) use ($headers): void {
                foreach ($headers as $key => $value) {
                    $message->getHeaders()->addTextHeader((string) $key, (string) $value);
                }
            });
        }

        foreach ($this->attachmentsData as $attachment) {
            if (isset($attachment['content'])) {
                $mail->attachData(
                    $attachment['content'],
                    $attachment['filename'],
                    ['mime' => $attachment['contentType'] ?? 'application/octet-stream']
                );
                continue;
            }

            if (isset($attachment['path'])) {
                $mail->attach($attachment['path'], [
                    'as' => $attachment['filename'] ?? null,
                    'mime' => $attachment['contentType'] ?? null,
                ]);
            }
        }

        return $mail;
    }
}
