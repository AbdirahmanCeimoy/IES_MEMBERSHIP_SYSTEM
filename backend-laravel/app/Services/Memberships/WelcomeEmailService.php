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
        'STUDENT' => 'Student Member (SMIES)',
        'GRADUATE' => 'Graduate Member (GMIES)',
        'ASSOCIATE' => 'Associate Member (AMIES)',
        'CORPORATE' => 'Corporate Member (CMIES)',
        'SENIOR' => 'Senior Member (SenMIES)',
        'FELLOW' => 'Fellow Member (FMIES)',
        'GRAD_TECHNICIAN' => 'Graduate Engineering Technician',
        'GRAD_TECHNOLOGIST' => 'Graduate Engineering Technologist',
    ];

    private const GRADE_MESSAGES = [
        'STUDENT' => 'As a Student Member, you are joining a community that will nurture your development as a future engineer. Engage in our student events, networking opportunities, and mentorship programmes to grow your professional foundation.',
        'GRADUATE' => 'As a Graduate Member, you are at the beginning of your professional engineering journey. Engage in our CPD programmes, technical seminars, and other professional development activities to advance your career.',
        'ASSOCIATE' => 'As an Associate Member, your experience and dedication to the engineering profession are recognised. Engage in our CPD programmes, technical activities, and IES committees to contribute to the profession.',
        'CORPORATE' => 'As a Corporate Member, you are a fully-qualified engineering professional recognised by the Institution. Engage in our CPD programmes, technical events, and leadership opportunities to shape engineering practice in Somalia.',
        'SENIOR' => 'As a Senior Member, your leadership and technical expertise are highly valued. Engage in our CPD programmes, mentorship activities, and strategic initiatives to shape national engineering policy.',
        'FELLOW' => 'As a Fellow, you represent the highest tier of engineering distinction at IES. Engage in our leadership programmes, professional forums, and mentorship activities to inspire the next generation of Somali engineers.',
        'GRAD_TECHNICIAN' => 'As a Graduate Engineering Technician, your technical skills strengthen the engineering workforce. Engage in our CPD programmes, capacity-building activities, and technical training initiatives to advance your career.',
        'GRAD_TECHNOLOGIST' => 'As a Graduate Engineering Technologist, your applied engineering expertise contributes to the profession. Engage in our CPD programmes, technical events, and professional development activities to advance your career.',
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

        // Strip common professional title prefixes so greeting uses the actual name.
        $titles = ['Eng.', 'Eng', 'Dr.', 'Dr', 'Prof.', 'Prof', 'Mr.', 'Mr', 'Mrs.', 'Mrs', 'Ms.', 'Ms', 'Miss', 'Sir', 'Hon.', 'Hon'];
        $cleanName = trim(preg_replace('/^(' . implode('|', array_map(fn($t) => preg_quote($t, '/'), $titles)) . ')\s+/i', '', $fullName));
        if ($cleanName === '') {
            $cleanName = $fullName;
        }
        // Use only the first name for the greeting.
        $firstName = trim(explode(' ', $cleanName)[0] ?? '');
        if ($firstName === '') {
            $firstName = 'Member';
        }

        $gradeCode = strtoupper((string) ($input['grade'] ?? ''));
        $gradeLabel = self::GRADE_LABELS[$gradeCode] ?? 'IES Member';
        $gradeMessage = self::GRADE_MESSAGES[$gradeCode] ?? 'We are delighted to welcome you to Somalia\'s national engineering community.';
        $subject = 'Welcome to the Institution of Engineers Somalia (IES) - ' . $gradeLabel;

        $html = $this->buildWelcomeHtml($firstName, $gradeLabel, $gradeMessage);
        $text = $this->buildWelcomeText($firstName, $gradeLabel, $gradeMessage);

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

    private function buildWelcomeText(string $firstName, string $gradeLabel, string $gradeMessage): string
    {
        return implode("\n", [
            'IES Membership',
            'Welcome to IES',
            '',
            "Dear {$firstName},",
            '',
            'Welcome to the Institution of Engineers Somalia (IES).',
            '',
            "Your account has been created successfully as a {$gradeLabel} applicant.",
            '',
            $gradeMessage,
            '',
            'What happens next:',
            '  1. Complete your initial profile.',
            '  2. Upload the required documents for your membership category.',
            '  3. Submit your application. The Secretariat will review your application and supporting documents.',
            '  4. Track your application status and updates through your Membership Portal. Applications are normally reviewed within one to two weeks.',
            '',
            'Regards,',
            'IES Membership',
            '',
            '(c) IES Membership. All Rights Reserved.',
        ]);
    }

    private function buildWelcomeHtml(string $firstName, string $gradeLabel, string $gradeMessage): string
    {
        $safeName = htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8');
        $safeGrade = htmlspecialchars($gradeLabel, ENT_QUOTES, 'UTF-8');
        $safeMessage = htmlspecialchars($gradeMessage, ENT_QUOTES, 'UTF-8');
        $year = date('Y');

        return <<<HTML
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Welcome to the IES Member Portal</title>
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
              <h1 style="margin:0;font-size:26px;font-weight:700;letter-spacing:0.3px;">Welcome to IES</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#022D5A;">Dear {$safeName},</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
                Welcome to the <strong>Institution of Engineers Somalia (IES)</strong>. Your account has been created successfully.
              </p>

              <!-- Membership Category badge (blue button-style) -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td style="border-radius:10px;background:#035CB3;padding:16px 32px;box-shadow:0 4px 12px rgba(3,92,179,0.25);text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;color:#48C184;text-transform:uppercase;">Membership Category</p>
                    <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;">{$safeGrade}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 20px;font-size:14px;line-height:1.7;color:#334155;">
                {$safeMessage}
              </p>

              <p style="margin:16px 0 8px;font-size:14px;font-weight:600;color:#022D5A;">What happens next:</p>
              <ol style="margin:0 0 16px;padding-left:22px;font-size:14px;line-height:1.7;color:#334155;">
                <li>Complete your <strong>initial profile</strong>.</li>
                <li>Upload the <strong>required documents</strong> for your membership category.</li>
                <li>Submit your application. The Secretariat will review your application and supporting documents.</li>
                <li>Track your application status and updates through your <strong>Membership Portal</strong>. Applications are normally reviewed within one to two weeks.</li>
              </ol>

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
