<?php

namespace App\Services\Memberships;

use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\PHPMailer;
use Throwable;

/**
 * Sends the "Registration Confirmed" email to a single member right after they
 * register for an event. Uses the same PHPMailer/SMTP wiring as the other
 * membership emails so no new infrastructure is introduced.
 */
class EventRegistrationConfirmationService
{
    /**
     * @param  array{
     *   memberName: string,
     *   memberEmail: string,
     *   eventTitle: string,
     *   eventType: string,
     *   date: string,
     *   time: string,
     *   location: string,
     * }  $payload
     */
    public function send(array $payload): bool
    {
        $smtpHost = (string) env('SMTP_HOST', '');
        $smtpUser = (string) env('SMTP_USER', '');
        $smtpPass = (string) env('SMTP_PASS', '');
        if ($smtpHost === '' || $smtpUser === '' || $smtpPass === '') {
            Log::info('Registration confirmation skipped - SMTP not configured');
            return false;
        }

        $subject = 'Registration Confirmation - ' . $payload['eventTitle'];

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
            $mailer->addAddress($payload['memberEmail'], $payload['memberName']);
            $mailer->Subject = $subject;
            $mailer->isHTML(true);
            $mailer->Body = $this->buildHtml($payload);
            $mailer->AltBody = $this->buildText($payload);
            $mailer->send();
            return true;
        } catch (Throwable $exception) {
            Log::warning('Registration confirmation send failed: ' . $exception->getMessage());
            return false;
        }
    }

    private function buildText(array $p): string
    {
        return implode("\n", [
            'Dear ' . $p['memberName'] . ',',
            '',
            'REGISTRATION CONFIRMED',
            '',
            'Thank you for registering for the following event organized by the Institution of Engineers Somalia (IES).',
            '',
            'We are pleased to confirm that your registration has been successfully completed and confirmed.',
            '',
            'Event Details',
            '',
            'Event Title:          ' . $p['eventTitle'],
            'Event Type:           ' . $p['eventType'],
            'Date:                 ' . $p['date'],
            'Time:                 ' . $p['time'],
            'Location:             ' . $p['location'],
            'Registration Status:  Confirmed',
            '',
            'We look forward to welcoming you and appreciate your participation in this IES event.',
            '',
            'Please retain this email for your records and future reference.',
            '',
            'Should you require any further information or assistance regarding the event, please contact the IES Secretariat.',
            '',
            'Best regards,',
            'The Institution of Engineers Somalia (IES)',
            'Email: info@iesomalia.org.so',
            'Website: iesomalia.org.so',
            'Tel: +252 612267178 | +252 612267137',
            '',
            '(c) ' . date('Y') . ' The Institution of Engineers Somalia (IES). All rights reserved.',
        ]);
    }

    private function buildHtml(array $p): string
    {
        $esc = fn (string $s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
        $name = $esc($p['memberName']);
        $title = $esc($p['eventTitle']);
        $type = $esc($p['eventType']);
        $date = $esc($p['date']);
        $time = $esc($p['time']);
        $location = $esc($p['location']);
        $year = date('Y');

        return <<<HTML
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Registration Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f6f8fb;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(8,43,85,0.08);">
      <tr>
        <td style="background:linear-gradient(135deg,#035CB3 0%,#024A8F 100%);padding:28px 32px;text-align:center;color:#ffffff;">
          <p style="margin:0;font-size:11px;letter-spacing:3px;color:#48C184;text-transform:uppercase;font-weight:700;">Registration Confirmed</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;line-height:1.3;">{$title}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;font-size:14px;line-height:1.6;color:#334155;">
          <p style="margin:0 0 14px;font-size:15px;color:#0f172a;">Dear <strong>{$name}</strong>,</p>
          <p style="margin:0 0 14px;">
            Thank you for registering for the following event organized by the <strong>Institution of Engineers Somalia (IES)</strong>.
          </p>
          <p style="margin:0 0 20px;">
            We are pleased to confirm that your registration has been successfully completed and confirmed.
          </p>

          <h2 style="margin:24px 0 10px;color:#022D5A;font-size:15px;letter-spacing:0.5px;text-transform:uppercase;">Event Details</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr style="background:#f8fafc;"><td style="padding:10px 14px;font-weight:600;color:#022D5A;width:170px;">Event Title</td><td style="padding:10px 14px;">{$title}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;color:#022D5A;border-top:1px solid #e2e8f0;">Event Type</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;">{$type}</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:10px 14px;font-weight:600;color:#022D5A;border-top:1px solid #e2e8f0;">Date</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;">{$date}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;color:#022D5A;border-top:1px solid #e2e8f0;">Time</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;">{$time}</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:10px 14px;font-weight:600;color:#022D5A;border-top:1px solid #e2e8f0;">Location</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;">{$location}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;color:#022D5A;border-top:1px solid #e2e8f0;">Registration Status</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;color:#2d7a50;font-weight:700;">Confirmed</td></tr>
          </table>

          <p style="margin:20px 0 14px;">
            We look forward to welcoming you and appreciate your participation in this IES event.
          </p>
          <p style="margin:0 0 14px;color:#64748b;font-size:13px;">
            Please retain this email for your records and future reference.
          </p>
          <p style="margin:0 0 24px;color:#64748b;font-size:13px;">
            Should you require any further information or assistance regarding the event, please contact the IES Secretariat.
          </p>

          <p style="margin:0;color:#0f172a;">Best regards,</p>
          <p style="margin:2px 0 0;font-weight:700;color:#022D5A;">The Institution of Engineers Somalia (IES)</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;background:#022D5A;color:#cbd5e1;text-align:center;font-size:11px;line-height:1.6;">
          <p style="margin:0;">Email: <a href="mailto:info@iesomalia.org.so" style="color:#48C184;text-decoration:none;">info@iesomalia.org.so</a> &middot; Website: <a href="https://iesomalia.org.so" style="color:#48C184;text-decoration:none;">iesomalia.org.so</a></p>
          <p style="margin:4px 0 0;">Tel: +252 612267178 &nbsp;|&nbsp; +252 612267137</p>
          <p style="margin:10px 0 0;color:#64748b;">&copy; {$year} The Institution of Engineers Somalia (IES). All rights reserved.</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>
HTML;
    }
}
