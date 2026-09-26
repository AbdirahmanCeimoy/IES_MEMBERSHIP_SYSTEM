<?php

namespace App\Services\Memberships;

use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\PHPMailer;
use RuntimeException;
use Throwable;

/**
 * WelcomeEmailService - fires a branded HTML welcome letter to newly
 * signed-up users. Reuses the existing SMTP configuration used by the
 * membership notification pipeline.
 */
class WelcomeEmailService
{
    private const GRADE_LABELS = [
        'STUDENT' => 'Student Member',
        'GRADUATE' => 'Graduate Member',
        'ASSOCIATE' => 'Associate Member',
        'CORPORATE' => 'Corporate Member',
        'SENIOR' => 'Senior Member',
        'FELLOW' => 'Fellow Member',
        'GRAD_TECHNICIAN' => 'Graduate Engineering Technician',
        'GRAD_TECHNOLOGIST' => 'Graduate Engineering Technologist',
    ];

    private const GRADE_MESSAGES = [
        'STUDENT' => 'As a Student Member, you are joining a community that will nurture your development as a future engineer. Take advantage of our student events, networking opportunities, and mentorship programs.',
        'GRADUATE' => 'As a Graduate Member, you are at the beginning of your professional engineering journey. Engage with our CPD programs, technical seminars, and Corporate Membership pathway to accelerate your career.',
        'ASSOCIATE' => 'As an Associate Member, your experience and dedication to the engineering profession are recognised. We look forward to your contribution to IES committees and technical activities.',
        'CORPORATE' => 'As a Corporate Member, you are a fully-qualified engineering professional recognised by the Institution. Your expertise will help shape engineering standards and practice in Somalia.',
        'SENIOR' => 'As a Senior Member, your leadership and technical expertise are highly valued. We invite you to mentor emerging engineers and participate in shaping national engineering policy.',
        'FELLOW' => 'As a Fellow, you represent the highest tier of engineering distinction at IES. Your outstanding contribution to the profession will inspire the next generation of Somali engineers.',
        'GRAD_TECHNICIAN' => 'As a Graduate Engineering Technician, your technical skills strengthen the engineering workforce. Engage with our capacity-building programs and technical training initiatives.',
        'GRAD_TECHNOLOGIST' => 'As a Graduate Engineering Technologist, your applied engineering expertise contributes to the profession. Take advantage of our CPD programs and technology-focused events.',
    ];

    /**
     * Send a welcome letter to a newly-registered user.
     * Silently no-ops when SMTP is not configured (dev / seed mode).
     */
    public function sendWelcomeEmail(array $input): void
    {
        $recipient = trim((string) ($input['email'] ?? ''));
        if ($recipient === '') {
            return;
        }

        $smtpHost = (string) config('smtp.host', env('SMTP_HOST', ''));
        $smtpUser = (string) config('smtp.user', env('SMTP_USER', ''));
        $smtpPass = (string) config('smtp.pass', env('SMTP_PASS', ''));
        if ($smtpHost === '' || $smtpUser === '' || $smtpPass === '') {
            Log::info('Welcome email skipped for ' . $recipient . ' - SMTP not configured');
            return;
        }

        $fullName = trim((string) ($input['fullName'] ?? 'Member'));
        $gradeCode = strtoupper((string) ($input['grade'] ?? ''));
        $gradeLabel = self::GRADE_LABELS[$gradeCode] ?? 'IES Member';
        $gradeMessage = self::GRADE_MESSAGES[$gradeCode] ?? 'We are delighted to welcome you to Somalia\'s national engineering community.';
        $subject = 'Welcome to the Institution of Engineers Somalia - ' . $gradeLabel;

        $html = $this->buildWelcomeHtml($fullName, $gradeLabel, $gradeMessage);
        $text = $this->buildWelcomeText($fullName, $gradeLabel, $gradeMessage);

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
            Log::warning('WelcomeEmail send failed for ' . $recipient . ': ' . $exception->getMessage());
            throw new RuntimeException('Welcome email could not be sent.', 0, $exception);
        }
    }

    private function buildWelcomeText(string $fullName, string $gradeLabel, string $gradeMessage): string
    {
        return implode("\n", [
            "Dear {$fullName},",
            '',
            'Welcome to the Institution of Engineers Somalia (IES).',
            '',
            "Your account has been created successfully as a {$gradeLabel} applicant.",
            '',
            $gradeMessage,
            '',
            'What happens next:',
            '  1. Complete your Initial Profile with photo, ID and discipline.',
            '  2. Attach the required documents for your grade.',
            '  3. Submit your application - the Secretariat will review it.',
            '  4. You will be notified by email once a decision is made.',
            '',
            'If you have any questions, contact info@iesomalia.org.so.',
            '',
            'Regards,',
            'IES Membership Secretariat',
            'Institution of Engineers Somalia',
        ]);
    }

    private function buildWelcomeHtml(string $fullName, string $gradeLabel, string $gradeMessage): string
    {
        $safeName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
        $safeGrade = htmlspecialchars($gradeLabel, ENT_QUOTES, 'UTF-8');
        $safeMessage = htmlspecialchars($gradeMessage, ENT_QUOTES, 'UTF-8');
        $year = date('Y');

        return <<<HTML
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Welcome to IES</title>
</head>
<body style="margin:0;padding:0;background:#f6f8fb;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(8,43,85,0.08);">
          <!-- Blue header band -->
          <tr>
            <td style="background:linear-gradient(135deg,#082B55 0%,#0047AB 100%);padding:32px 32px 24px;text-align:center;color:#ffffff;">
              <div style="display:inline-block;width:64px;height:64px;background:#ffffff;border-radius:50%;line-height:64px;font-size:28px;font-weight:800;color:#082B55;">IES</div>
              <h1 style="margin:16px 0 4px;font-size:22px;font-weight:700;letter-spacing:0.5px;">Institution of Engineers Somalia</h1>
              <p style="margin:0;font-size:12px;letter-spacing:2px;color:#48C184;text-transform:uppercase;">Welcome Letter</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;">Dear <strong>{$safeName}</strong>,</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
                Welcome to the <strong>Institution of Engineers Somalia (IES)</strong>. Your account has been created successfully.
              </p>

              <div style="margin:20px 0;padding:16px 20px;background:#f0f9f4;border-left:4px solid #48C184;border-radius:6px;">
                <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#3AA870;text-transform:uppercase;">Application Grade</p>
                <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#082B55;">{$safeGrade}</p>
              </div>

              <p style="margin:16px 0 20px;font-size:14px;line-height:1.7;color:#334155;">
                {$safeMessage}
              </p>

              <p style="margin:16px 0 8px;font-size:14px;font-weight:600;color:#082B55;">What happens next:</p>
              <ol style="margin:0 0 16px;padding-left:22px;font-size:14px;line-height:1.7;color:#334155;">
                <li>Complete your <strong>Initial Profile</strong> with photo, ID and discipline.</li>
                <li>Attach the <strong>required documents</strong> for your grade.</li>
                <li>Submit your application - the Secretariat will review it.</li>
                <li>You will be notified by email once a decision is made.</li>
              </ol>

              <p style="margin:20px 0 0;font-size:14px;color:#334155;">
                Regards,<br>
                <strong style="color:#082B55;">IES Membership Secretariat</strong><br>
                <span style="color:#64748b;font-size:12px;">Institution of Engineers Somalia</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#082B55;color:#94a3b8;text-align:center;font-size:11px;">
              <p style="margin:0 0 4px;color:#ffffff;font-weight:600;">Institution of Engineers Somalia</p>
              <p style="margin:0;">info@iesomalia.org.so &middot; iesomalia.org.so</p>
              <p style="margin:8px 0 0;color:#64748b;">&copy; {$year} IES. All rights reserved.</p>
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
