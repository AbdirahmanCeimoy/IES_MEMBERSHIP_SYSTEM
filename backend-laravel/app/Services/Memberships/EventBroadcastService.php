<?php

namespace App\Services\Memberships;

use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\PHPMailer;
use Throwable;

/**
 * Broadcast a "new IES event" announcement to a batch of member emails.
 * Uses BCC to reduce SMTP round-trips while keeping recipients private.
 */
class EventBroadcastService
{
    public function broadcastNewEvent(array $recipientEmails, array $event): int
    {
        if (empty($recipientEmails)) return 0;

        $smtpHost = (string) env('SMTP_HOST', '');
        $smtpUser = (string) env('SMTP_USER', '');
        $smtpPass = (string) env('SMTP_PASS', '');
        if ($smtpHost === '' || $smtpUser === '' || $smtpPass === '') {
            Log::info('Event broadcast skipped - SMTP not configured');
            return 0;
        }

        $subject = 'New IES Event: ' . $event['title'];
        $html = $this->buildEventHtml($event);
        $text = $this->buildEventText($event);
        $sent = 0;

        // Send in batches of 50 recipients via BCC.
        foreach (array_chunk(array_unique($recipientEmails), 50) as $batch) {
            try {
                $mailer = new PHPMailer(true);
                $mailer->isSMTP();
                $mailer->Host = $smtpHost;
                $mailer->SMTPAuth = true;
                $mailer->Username = $smtpUser;
                $mailer->Password = $smtpPass;
                $mailer->Port = (int) env('SMTP_PORT', 465);
                $encryption = (string) env('SMTP_ENCRYPTION', 'ssl');
                if ($encryption === 'ssl') {
                    $mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                } elseif ($encryption === 'tls') {
                    $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                }

                $fromRaw = (string) env('SMTP_FROM', $smtpUser);
                $fromEmail = $smtpUser;
                $fromName = 'IES Events';
                if (preg_match('/^(.+?)\s*<(.+?)>$/', $fromRaw, $m) === 1) {
                    $fromName = trim($m[1], " \t\"'");
                    $fromEmail = trim($m[2]);
                } elseif (str_contains($fromRaw, '@')) {
                    $fromEmail = trim($fromRaw);
                }
                $mailer->setFrom($fromEmail, $fromName);
                $mailer->addAddress($fromEmail, $fromName);
                foreach ($batch as $bcc) {
                    $mailer->addBCC($bcc);
                }
                $mailer->Subject = $subject;
                $mailer->isHTML(true);
                $mailer->Body = $html;
                $mailer->AltBody = $text;
                $mailer->send();
                $sent += count($batch);
            } catch (Throwable $exception) {
                Log::warning('Event broadcast batch failed: ' . $exception->getMessage());
            }
        }

        return $sent;
    }

    private function buildEventText(array $e): string
    {
        return implode("\n", [
            'A new IES event has been published:',
            '',
            'Title:    ' . $e['title'],
            'Type:     ' . ucfirst(strtolower($e['type'])),
            'Date:     ' . $e['date'],
            'Location: ' . ($e['location'] ?: '-'),
            'CPD:      ' . $e['cpdHours'] . ' hours',
            '',
            $e['description'] ?: '',
            '',
            'Sign in to your member portal to register.',
            '',
            'Regards,',
            'IES Membership Secretariat',
        ]);
    }

    private function buildEventHtml(array $e): string
    {
        $safeTitle = htmlspecialchars($e['title'], ENT_QUOTES, 'UTF-8');
        $safeType = htmlspecialchars(ucfirst(strtolower($e['type'])), ENT_QUOTES, 'UTF-8');
        $safeDate = htmlspecialchars($e['date'], ENT_QUOTES, 'UTF-8');
        $safeLocation = htmlspecialchars($e['location'] ?: '-', ENT_QUOTES, 'UTF-8');
        $cpd = number_format((float) $e['cpdHours'], 1);
        $desc = $e['description'] ? '<p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#334155;">' . nl2br(htmlspecialchars($e['description'], ENT_QUOTES, 'UTF-8')) . '</p>' : '';
        $year = date('Y');

        return <<<HTML
<!doctype html>
<html><head><meta charset="utf-8"><title>New IES Event</title></head>
<body style="margin:0;padding:0;background:#f6f8fb;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(8,43,85,0.08);">
<tr><td style="background:linear-gradient(135deg,#082B55 0%,#0047AB 100%);padding:28px 32px;text-align:center;color:#ffffff;">
  <p style="margin:0;font-size:11px;letter-spacing:3px;color:#48C184;text-transform:uppercase;font-weight:700;">New IES Event</p>
  <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;">{$safeTitle}</h1>
</td></tr>
<tr><td style="padding:28px 32px;">
  <table role="presentation" width="100%" style="font-size:14px;color:#334155;">
    <tr><td style="padding:6px 0;font-weight:600;color:#082B55;width:100px;">Type</td><td style="padding:6px 0;">{$safeType}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;color:#082B55;">Date</td><td style="padding:6px 0;">{$safeDate}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;color:#082B55;">Location</td><td style="padding:6px 0;">{$safeLocation}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;color:#082B55;">CPD Hours</td><td style="padding:6px 0;">{$cpd}</td></tr>
  </table>
  {$desc}
  <div style="margin-top:24px;">
    <a href="https://iesomalia.org.so/member/events" style="display:inline-block;background:#48C184;color:#082B55;padding:10px 20px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px;">Register in member portal</a>
  </div>
</td></tr>
<tr><td style="padding:20px 32px;background:#082B55;color:#94a3b8;text-align:center;font-size:11px;">
  <p style="margin:0;color:#ffffff;font-weight:600;">Institution of Engineers Somalia</p>
  <p style="margin:0;">info@iesomalia.org.so &middot; iesomalia.org.so</p>
  <p style="margin:8px 0 0;color:#64748b;">&copy; {$year} IES. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>
HTML;
    }
}
