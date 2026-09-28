<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\PHPMailer;
use RuntimeException;
use Throwable;

/**
 * Sends a professionally-branded IES email verification code.
 */
class EmailVerificationService
{
    /** Send an email verification code to the user. */
    public function sendVerificationEmail(array $input): void
    {
        $recipient = trim((string) ($input['email'] ?? ''));
        if ($recipient === '') {
            return;
        }

        $smtpHost = (string) config('smtp.host', env('SMTP_HOST', ''));
        $smtpUser = (string) config('smtp.user', env('SMTP_USER', ''));
        $smtpPass = (string) config('smtp.pass', env('SMTP_PASS', ''));
        if ($smtpHost === '' || $smtpUser === '' || $smtpPass === '') {
            Log::info('Email verification skipped for ' . $recipient . ' - SMTP not configured');
            return;
        }

        $fullName = trim((string) ($input['fullName'] ?? 'Member'));
        $otp = (string) ($input['otp'] ?? '');

        // Strip common professional title prefixes so greeting uses the actual name.
        $titles = ['Eng.', 'Eng', 'Dr.', 'Dr', 'Prof.', 'Prof', 'Mr.', 'Mr', 'Mrs.', 'Mrs', 'Ms.', 'Ms', 'Miss', 'Sir', 'Hon.', 'Hon'];
        $cleanName = trim(preg_replace('/^(' . implode('|', array_map(fn($t) => preg_quote($t, '/'), $titles)) . ')\s+/i', '', $fullName));
        if ($cleanName === '') {
            $cleanName = $fullName;
        }
        $firstName = trim(explode(' ', $cleanName)[0] ?? '');
        if ($firstName === '') {
            $firstName = 'Member';
        }

        $subject = 'IES Membership - Verify your IES Email Address';
        $html = $this->buildVerificationHtml($firstName, $otp);
        $text = $this->buildVerificationText($firstName, $otp);

        try {
            $mailer = new PHPMailer(true);
            $mailer->isSMTP();
            $mailer->Host = $smtpHost;
            $mailer->SMTPAuth = true;
            $mailer->Username = $smtpUser;
            $mailer->Password = $smtpPass;
            $mailer->Port = (int) (config('smtp.port', env('SMTP_PORT', 465)));
            $encryption = (string) config('smtp.encryption', env('SMTP_ENCRYPTION', 'ssl'));
            if ($encryption === 'ssl') {
                $mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($encryption === 'tls') {
                $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }

            $fromRaw = (string) config('smtp.from', env('SMTP_FROM', $smtpUser));
            $fromEmail = $smtpUser;
            $fromName = 'IES Membership';
            if (preg_match('/^(.+?)\s*<(.+?)>$/', $fromRaw, $m) === 1) {
                $fromName = trim($m[1], " \t\"'");
                $fromEmail = trim($m[2]);
            } elseif (str_contains($fromRaw, '@')) {
                $fromEmail = trim($fromRaw);
            }

            $mailer->setFrom($fromEmail, $fromName);
            $mailer->addAddress($recipient, $fullName);
            $mailer->addReplyTo((string) config('smtp.reply_to', env('SMTP_REPLY_TO', $fromEmail)));
            $mailer->Subject = $subject;
            $mailer->isHTML(true);
            $mailer->Body = $html;
            $mailer->AltBody = $text;
            $mailer->send();
        } catch (Throwable $exception) {
            Log::warning('Email verification failed for ' . $recipient . ': ' . $exception->getMessage());
            throw new RuntimeException('Email verification could not be sent.', 0, $exception);
        }
    }

    private function buildVerificationText(string $firstName, string $otp): string
    {
        return implode("\n", [
            'IES Membership',
            'Verify your IES Email Address',
            '',
            "Dear {$firstName},",
            '',
            'Welcome to IES Membership.',
            '',
            'Use the verification code below to confirm your email address and create your IES account.',
            '',
            'Your Verification Code',
            "    {$otp}",
            '',
            'This code will expire in 5 minutes.',
            '',
            'If you did not create an account with IES, please disregard this email.',
            '',
            'Regards,',
            'IES Membership',
            '',
            '(c) IES Membership. All Rights Reserved.',
        ]);
    }

    private function buildVerificationHtml(string $firstName, string $otp): string
    {
        $safeName = htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8');
        $safeOtp = htmlspecialchars($otp, ENT_QUOTES, 'UTF-8');
        $year = date('Y');

        return <<<HTML
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Verify your IES Email Address</title>
</head>
<body style="margin:0;padding:0;background:#f6f8fb;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(3,92,179,0.10);">
          <!-- Blue header band -->
          <tr>
            <td style="background:linear-gradient(135deg,#022D5A 0%,#035CB3 100%);padding:36px 32px 32px;text-align:center;color:#ffffff;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;color:#48C184;text-transform:uppercase;font-weight:700;">IES Membership</p>
              <h1 style="margin:0;font-size:26px;font-weight:700;letter-spacing:0.3px;">Verify your IES Email Address</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#022D5A;">Dear {$safeName},</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
                Welcome to <strong>IES Membership</strong>.
              </p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#334155;">
                Use the verification code below to confirm your email address and create your IES account.
              </p>

              <p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:1.5px;color:#3AA870;text-transform:uppercase;text-align:center;">Your Verification Code</p>

              <!-- OTP Code as blue button-style box -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td style="border-radius:10px;background:#035CB3;padding:22px 48px;box-shadow:0 4px 12px rgba(3,92,179,0.25);">
                    <p style="margin:0;font-size:34px;font-weight:800;letter-spacing:10px;color:#ffffff;font-family:'Courier New',monospace;">{$safeOtp}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:13px;color:#64748b;text-align:center;">
                This code will expire in <strong style="color:#022D5A;">5 minutes</strong>.
              </p>

              <div style="margin:24px 0;padding:14px 18px;background:#fef9e7;border-left:4px solid #f59e0b;border-radius:6px;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#78350f;">
                  If you did not create an account with IES, please disregard this email.
                </p>
              </div>

              <p style="margin:24px 0 0;font-size:14px;color:#334155;">
                Regards,<br>
                <strong style="color:#022D5A;">IES Membership</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#022D5A;color:#94a3b8;text-align:center;font-size:11px;">
              <p style="margin:0 0 4px;color:#ffffff;font-weight:600;">The Institution of Engineers Somalia (IES).</p>
              <p style="margin:8px 0 0;color:#64748b;">&copy; {$year} IES Membership. All Rights Reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
    }
}
