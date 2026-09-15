<?php

namespace App\Services\Memberships;

use App\Enums\EmailNotificationStatus;
use App\Enums\EmailNotificationType;
use App\Enums\MembershipGrade;
use App\Mail\MembershipNotificationMail;
use App\Models\EmailNotificationLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use RuntimeException;
use Throwable;

class MembershipNotificationService
{
    private const BRAND_BLUE = '#1B5EAC';

    private const BRAND_GREEN = '#86C440';

    private const BRAND_NAVY = '#0F172A';

    private const BRAND_STEEL = '#475569';

    private const EMAIL_RETRY_ATTEMPTS = 3;

    private const SMTP_CONNECTION_TIMEOUT_MS = 10000;

    private const SMTP_GREETING_TIMEOUT_MS = 10000;

    private const SMTP_SOCKET_TIMEOUT_MS = 20000;

    private const EMAIL_SUMMARY_LABELS = [
        'Application Reference',
        'Submission Date',
        'Registration Number',
        'Certificate Number',
        'Valid Until',
        'Decision Date',
        'Reason',
        'Applicant Name',
        'Email',
        'Grade',
    ];

    private const GRADE_LABELS = [
        MembershipGrade::STUDENT->value => 'Student Member',
        MembershipGrade::GRADUATE->value => 'Graduate Member',
        MembershipGrade::ASSOCIATE->value => 'Associate Member',
        MembershipGrade::CORPORATE->value => 'Corporate Member',
        MembershipGrade::SENIOR->value => 'Senior Member',
        MembershipGrade::FELLOW->value => 'Fellow',
    ];

    private const COMMON_RIGHTS = [
        'Participation in IES professional activities and technical forums.',
        'Access to official member communication, notices, and opportunities.',
        'Fair professional representation in accordance with IES policy.',
        'Opportunity to join CPD programs, workshops, and mentoring tracks.',
    ];

    private const GRADE_RIGHTS = [
        MembershipGrade::STUDENT->value => [
            'Student chapter engagement and early-career support programs.',
            'Guided transition pathway toward Graduate membership grade.',
        ],
        MembershipGrade::GRADUATE->value => [
            'Eligibility for graduate-focused professional development pathways.',
            'Structured progression support toward higher membership grades.',
        ],
        MembershipGrade::ASSOCIATE->value => [
            'Recognition of technical practice aligned with Associate criteria.',
            'Access to skills-upgrade programs for grade advancement.',
        ],
        MembershipGrade::CORPORATE->value => [
            'Corporate-grade professional identity within IES networks.',
            'Eligibility for advanced practice, leadership, and policy forums.',
        ],
        MembershipGrade::SENIOR->value => [
            'Senior-grade recognition for leadership and professional contribution.',
            'Priority involvement in advanced technical and mentorship initiatives.',
        ],
        MembershipGrade::FELLOW->value => [
            'Highest professional distinction track within the IES framework.',
            'Eligibility to contribute to strategic guidance and peer leadership.',
        ],
    ];

    public function verifyDeliveryReady(): array
    {
        $this->ensureSmtpConfig();

        if (! app()->environment('testing')) {
            $this->verifySmtpConnection();
        }

        return ['status' => 'ok'];
    }

    public function sendSubmissionEmail(array $input): array
    {
        $gradeLabel = self::GRADE_LABELS[$input['membershipGrade']->value] ?? $input['membershipGrade']->value;
        $subject = "IES Membership Application Received | {$gradeLabel}";

        $text = implode("\n", [
            "Dear {$input['fullName']},",
            '',
            'Thank you for registering with the Institution of Engineers Somalia (IES).',
            "We confirm that your application details and supporting documents for {$gradeLabel} have been received and recorded successfully.",
            '',
            "Application Reference: {$input['applicationId']}",
            'Submission Date: ' . $this->formatLocalDate($input['createdAt']),
            '',
            'Your application is now under screening and technical review.',
            'You will receive another official email once a final decision has been made.',
            'An A4 acknowledgement letter is attached for your records.',
            '',
            'Regards,',
            'IES Membership Secretariat',
        ]);

        try {
            return $this->sendTrackedEmail([
                'applicationId' => $input['applicationId'],
                'type' => EmailNotificationType::SUBMISSION,
                'recipientEmail' => $input['email'],
                'subject' => $subject,
                'text' => $text,
                'html' => $this->buildHtmlFromText($subject, $text, $gradeLabel),
                'attachments' => [[
                    'filename' => 'ies-membership-receipt-' . substr($input['applicationId'], -8) . '.pdf',
                    'content' => $this->buildLetterPdf(
                        'APPLICATION RECEIVED',
                        $subject,
                        $text
                    ),
                    'contentType' => 'application/pdf',
                ]],
            ]);
        } catch (Throwable $exception) {
            Log::error('Failed to send application acknowledgement email to ' . $input['email'] . ': ' . $exception->getMessage());
            throw new RuntimeException('Application acknowledgement email could not be delivered.');
        }
    }

    public function sendApprovalEmail(array $input): array
    {
        $gradeLabel = self::GRADE_LABELS[$input['membershipGrade']->value] ?? $input['membershipGrade']->value;
        $subject = "IES Membership Application Approved | {$gradeLabel}";
        $validUntilText = isset($input['validUntil']) && $input['validUntil'] !== null
            ? $this->formatLocalDate($input['validUntil'])
            : 'As per IES policy';
        $decisionDateText = isset($input['decidedAt']) && $input['decidedAt'] !== null
            ? $this->formatLocalDate($input['decidedAt'])
            : $this->formatLocalDate(now());

        $text = implode("\n", [
            "Dear {$input['fullName']},",
            '',
            'Congratulations from the Institution of Engineers Somalia (IES).',
            "We are pleased to inform you that your application for {$gradeLabel} has been approved.",
            '',
            "Application Reference: {$input['applicationId']}",
            'Registration Number: ' . ($input['registrationNumber'] ?? 'Will be shared shortly'),
            'Certificate Number: ' . ($input['certificateNumber'] ?? 'Will be shared shortly'),
            "Valid Until: {$validUntilText}",
            "Decision Date: {$decisionDateText}",
            '',
            'Please keep this message for your records.',
            'Welcome to IES. We look forward to your professional contribution and participation.',
            '',
            'You can now access approved member rights and opportunities according to IES policy.',
            'Regards,',
            'IES Membership Secretariat',
        ]);

        try {
            return $this->sendTrackedEmail([
                'applicationId' => $input['applicationId'],
                'type' => EmailNotificationType::APPROVAL,
                'recipientEmail' => $input['email'],
                'subject' => $subject,
                'text' => $text,
                'html' => $this->buildHtmlFromText($subject, $text, $gradeLabel),
                'attachments' => [[
                    'filename' => 'ies-approval-letter-' . substr($input['applicationId'], -8) . '.pdf',
                    'content' => $this->buildLetterPdf(
                        'APPROVAL NOTICE',
                        $subject,
                        $text
                    ),
                    'contentType' => 'application/pdf',
                ]],
            ]);
        } catch (Throwable $exception) {
            Log::error('Failed to send approval email to ' . $input['email'] . ': ' . $exception->getMessage());
            throw new RuntimeException('Approval email could not be delivered.');
        }
    }

    public function sendRejectionEmail(array $input): array
    {
        $gradeLabel = self::GRADE_LABELS[$input['membershipGrade']->value] ?? $input['membershipGrade']->value;
        $subject = "IES Membership Application Update | {$gradeLabel}";
        $reasonText = trim((string) ($input['rejectionReason'] ?? '')) ?: 'No specific reason was provided.';
        $decisionDateText = isset($input['decidedAt']) && $input['decidedAt'] !== null
            ? $this->formatLocalDate($input['decidedAt'])
            : $this->formatLocalDate(now());

        $text = implode("\n", [
            "Dear {$input['fullName']},",
            '',
            "Thank you for your application to the Institution of Engineers Somalia (IES) for {$gradeLabel}.",
            'After careful review, we regret to inform you that your application could not be approved at this time.',
            '',
            "Application Reference: {$input['applicationId']}",
            "Decision Date: {$decisionDateText}",
            "Reason: {$reasonText}",
            '',
            'We sincerely apologize for the disappointment this may cause.',
            'This is not a permanent refusal. You are welcome to submit a fresh application in a future intake or in the coming year after strengthening the required documents and eligibility evidence.',
            'If you need guidance before reapplying, you may contact the IES Membership Secretariat.',
            '',
            'We appreciate your interest in joining IES.',
            'Regards,',
            'IES Membership Secretariat',
        ]);

        try {
            return $this->sendTrackedEmail([
                'applicationId' => $input['applicationId'],
                'type' => EmailNotificationType::REJECTION,
                'recipientEmail' => $input['email'],
                'subject' => $subject,
                'text' => $text,
                'html' => $this->buildHtmlFromText($subject, $text, $gradeLabel),
                'attachments' => [[
                    'filename' => 'ies-decision-letter-' . substr($input['applicationId'], -8) . '.pdf',
                    'content' => $this->buildLetterPdf(
                        'APPLICATION UPDATE',
                        $subject,
                        $text
                    ),
                    'contentType' => 'application/pdf',
                ]],
            ]);
        } catch (Throwable $exception) {
            Log::error('Failed to send rejection email to ' . $input['email'] . ': ' . $exception->getMessage());
            throw new RuntimeException('Rejection email could not be delivered.');
        }
    }

    private function sendTrackedEmail(array $input): array
    {
        $log = EmailNotificationLog::query()->create([
            'applicationId' => $input['applicationId'],
            'type' => $input['type'],
            'recipientEmail' => $input['recipientEmail'],
            'subject' => $input['subject'],
            'status' => EmailNotificationStatus::PENDING,
        ]);

        $attempts = 0;

        try {
            $result = $this->sendMailWithRetry($input, $attempts);

            $log->fill([
                'status' => EmailNotificationStatus::SENT,
                'attempts' => $result['attempts'],
                'providerMessageId' => $result['providerMessageId'],
                'errorMessage' => null,
                'sentAt' => now(),
            ]);
            $log->save();

            Log::info(
                'Email delivered [' . $input['type']->value . '] to '
                . $input['recipientEmail']
                . ' for application '
                . $input['applicationId']
            );

            return ['sent' => true, 'logId' => $log->id];
        } catch (Throwable $exception) {
            $log->fill([
                'status' => EmailNotificationStatus::FAILED,
                'attempts' => $attempts,
                'errorMessage' => substr($exception->getMessage(), 0, 1000),
            ]);
            $log->save();

            throw $exception;
        }
    }

    private function sendMailWithRetry(array $input, int &$attempts): array
    {
        $this->ensureSmtpConfig();

        if (! app()->environment('testing')) {
            $this->verifySmtpConnection();
        }

        $lastError = null;

        for ($attempt = 1; $attempt <= self::EMAIL_RETRY_ATTEMPTS; $attempt++) {
            $attempts = $attempt;

            try {
                Mail::mailer('smtp')
                    ->to($input['recipientEmail'])
                    ->send(new MembershipNotificationMail(
                        $input['subject'],
                        $input['html'],
                        $input['text'],
                        $input['attachments'] ?? [],
                        $this->parseMailbox($this->env('SMTP_FROM')),
                        $this->parseMailbox($this->env('SMTP_REPLY_TO')),
                        trim($this->env('SMTP_AUDIT_BCC')) ?: null,
                        $this->buildTrackingHeaders($input)
                    ));

                return [
                    'attempts' => $attempt,
                    'providerMessageId' => null,
                ];
            } catch (Throwable $exception) {
                $lastError = $exception;
                Log::warning(
                    'Email attempt '
                    . $attempt
                    . '/'
                    . self::EMAIL_RETRY_ATTEMPTS
                    . ' failed for '
                    . $input['type']->value
                    . ' to '
                    . $input['recipientEmail']
                    . ': '
                    . $exception->getMessage()
                );

                if ($attempt < self::EMAIL_RETRY_ATTEMPTS) {
                    usleep($attempt * 500000);
                }
            }
        }

        throw $lastError instanceof Throwable
            ? $lastError
            : new RuntimeException('Unknown email send failure');
    }

    private function ensureSmtpConfig(): void
    {
        $smtpHost = trim($this->env('SMTP_HOST'));
        $smtpPortRaw = trim($this->env('SMTP_PORT'));
        $smtpUser = trim($this->env('SMTP_USER'));
        $smtpPass = trim((string) preg_replace('/\s+/', '', $this->env('SMTP_PASS')));
        $smtpFrom = trim($this->env('SMTP_FROM'));

        $missing = array_keys(array_filter([
            'SMTP_HOST' => $smtpHost,
            'SMTP_PORT' => $smtpPortRaw,
            'SMTP_USER' => $smtpUser,
            'SMTP_PASS' => $smtpPass,
            'SMTP_FROM' => $smtpFrom,
        ], static fn (string $value): bool => $value === ''));

        if ($missing !== []) {
            throw new RuntimeException(
                'SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.'
            );
        }

        $this->parsePositiveInt($smtpPortRaw, 587);
    }

    private function buildTrackingHeaders(array $input): array
    {
        return [
            'X-IES-Application-Id' => $input['applicationId'],
            'X-IES-Notification-Type' => $input['type']->value,
            'X-IES-Recipient' => $input['recipientEmail'],
        ];
    }

    private function verifySmtpConnection(): void
    {
        $host = trim($this->env('SMTP_HOST'));
        $port = $this->parsePositiveInt($this->env('SMTP_PORT', '587'), 587);
        $secure = $this->env('SMTP_SECURE') === 'true' || $port === 465;
        $timeoutSeconds = max(
            1,
            (int) ceil($this->parsePositiveInt(
                $this->env('SMTP_CONNECTION_TIMEOUT_MS', (string) self::SMTP_CONNECTION_TIMEOUT_MS),
                self::SMTP_CONNECTION_TIMEOUT_MS
            ) / 1000)
        );

        $transport = ($secure ? 'ssl://' : 'tcp://') . $host . ':' . $port;
        $errno = 0;
        $errstr = '';
        $socket = @stream_socket_client($transport, $errno, $errstr, $timeoutSeconds);

        if (! is_resource($socket)) {
            throw new RuntimeException('SMTP server connection failed. Please confirm the mail server settings.');
        }

        $greetingTimeout = max(
            1,
            (int) ceil($this->parsePositiveInt(
                $this->env('SMTP_GREETING_TIMEOUT_MS', (string) self::SMTP_GREETING_TIMEOUT_MS),
                self::SMTP_GREETING_TIMEOUT_MS
            ) / 1000)
        );

        stream_set_timeout($socket, $greetingTimeout);
        $banner = fgets($socket);
        fclose($socket);

        if ($banner === false || ! str_starts_with(trim($banner), '220')) {
            throw new RuntimeException('SMTP server connection failed. Please confirm the mail server settings.');
        }
    }

    private function parseMailbox(string $raw): ?array
    {
        $raw = trim($raw);

        if ($raw === '') {
            return null;
        }

        if (preg_match('/^(.*?)<(.+?)>$/', $raw, $matches) === 1) {
            $name = trim(trim($matches[1]), "\"' ");

            return [
                'address' => trim($matches[2]),
                'name' => $name !== '' ? $name : null,
            ];
        }

        return [
            'address' => $raw,
            'name' => null,
        ];
    }

    private function buildHtmlFromText(string $title, string $text, string $gradeLabel): string
    {
        $sections = $this->parseNotificationText($text);
        $logoHtml = $this->buildEmailLogoHtml();
        $showRights = str_contains($title, 'Approved') || str_contains($title, 'Received');
        $rightsHtml = $showRights
            ? implode('', array_map(
                fn (string $item): string => '<li style="margin:0 0 8px 0;line-height:1.7;color:' . self::BRAND_STEEL . ';">' . e($item) . '</li>',
                array_merge(self::COMMON_RIGHTS, self::GRADE_RIGHTS[$this->gradeValueFromLabel($gradeLabel)] ?? [])
            ))
            : '';
        $summaryRowsHtml = implode('', array_map(
            fn (array $item): string => '<tr>'
                . '<td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:' . self::BRAND_BLUE . ';text-transform:uppercase;letter-spacing:0.08em;width:34%;">' . e($item['label']) . '</td>'
                . '<td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;line-height:1.6;color:' . self::BRAND_NAVY . ';">' . e($item['value']) . '</td>'
                . '</tr>',
            $sections['summary']
        ));
        $paragraphsHtml = '';

        if ($sections['greeting'] !== null) {
            $paragraphsHtml .= '<p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:' . self::BRAND_NAVY . ';">'
                . e($sections['greeting'])
                . '</p>';
        }

        foreach ($sections['paragraphs'] as $paragraph) {
            $paragraphsHtml .= '<p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:' . self::BRAND_NAVY . ';">'
                . e($paragraph)
                . '</p>';
        }

        $eyebrow = str_contains($title, 'Approved')
            ? 'OFFICIAL APPROVAL'
            : (str_contains($title, 'Received') ? 'APPLICATION RECEIVED' : 'OFFICIAL UPDATE');
        $contactLine = $this->buildOfficialContactLine();

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#eef4fb;font-family:Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#eef4fb;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:794px;background:#ffffff;border:1px solid #d8e2ee;border-radius:22px;overflow:hidden;box-shadow:0 18px 42px rgba(15,23,42,0.10);">
          <tr>
            <td style="padding:0;background:linear-gradient(135deg, {$this->escapeHtml(self::BRAND_BLUE)} 0%, #0f4d8f 55%, #0b325c 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="padding:28px 24px 22px 28px;vertical-align:top;width:108px;">{$logoHtml}</td>
                  <td style="padding:24px 30px 22px 0;vertical-align:middle;">
                    <div style="font-size:11px;letter-spacing:0.28em;font-weight:700;color:#d9e8ff;">{$eyebrow}</div>
                    <div style="margin-top:10px;font-size:34px;line-height:1.18;font-weight:800;color:#ffffff;">{$this->escapeHtml($title)}</div>
                    <div style="margin-top:8px;font-size:13px;line-height:1.6;color:#d9e8ff;">Institution of Engineers Somalia</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height:6px;background:{$this->escapeHtml(self::BRAND_GREEN)};"></td>
          </tr>
          <tr>
            <td style="padding:30px 30px 12px;">
              {$paragraphsHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 30px 22px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #dbe7f3;border-radius:18px;background:#f8fbff;overflow:hidden;">
                <tr>
                  <td style="padding:14px 16px;background:#eff6ff;font-size:13px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:{$this->escapeHtml(self::BRAND_BLUE)};">Application Record</td>
                </tr>
                {$summaryRowsHtml}
              </table>
            </td>
          </tr>
          {$this->buildRightsSectionHtml($showRights, $rightsHtml)}
          <tr>
            <td style="padding:0 30px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e2e8f0;">
                <tr>
                  <td style="padding-top:16px;font-size:12px;line-height:1.8;color:{$this->escapeHtml(self::BRAND_STEEL)};">
                    Official communication from the Institution of Engineers Somalia (IES).<br />
                    {$this->escapeHtml($contactLine)}
                  </td>
                </tr>
              </table>
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

    private function buildLetterPdf(string $eyebrow, string $title, string $text): string
    {
        $sections = $this->parseNotificationText($text);
        $pageWidth = 595;
        $pageHeight = 842;
        $content = [];
        $logo = $this->resolvePdfLogoAsset();

        $content[] = $this->renderPdfFillRect(0, 710, $pageWidth, 132, self::BRAND_BLUE);
        $content[] = $this->renderPdfFillRect(0, 704, $pageWidth, 6, self::BRAND_GREEN);

        if ($logo !== null) {
            $logoWidth = 72;
            $logoHeight = max(52, (int) round($logoWidth * ($logo['height'] / max(1, $logo['width']))));
            $content[] = $this->renderPdfImage('Im1', 42, 748, $logoWidth, $logoHeight);
        }

        $content[] = $this->renderPdfTextBlock([$eyebrow], 132, 810, 10, 12, 'F2', '#D9E8FF');
        $content[] = $this->renderPdfTextBlock($this->wrapPdfText($title, 34), 132, 786, 22, 25, 'F2', '#FFFFFF');
        $content[] = $this->renderPdfTextBlock(['Institution of Engineers Somalia'], 132, 734, 11, 13, 'F1', '#D9E8FF');

        $cursorY = 660;

        if ($sections['greeting'] !== null) {
            $greetingLines = $this->wrapPdfText($sections['greeting'], 72);
            $content[] = $this->renderPdfTextBlock($greetingLines, 44, $cursorY, 12, 16, 'F2', self::BRAND_NAVY);
            $cursorY -= (count($greetingLines) * 16) + 14;
        }

        foreach ($sections['paragraphs'] as $paragraph) {
            $paragraphLines = $this->wrapPdfText($paragraph, 84);
            $content[] = $this->renderPdfTextBlock($paragraphLines, 44, $cursorY, 11, 16, 'F1', self::BRAND_NAVY);
            $cursorY -= (count($paragraphLines) * 16) + 12;
        }

        if ($sections['summary'] !== []) {
            $boxHeight = 42 + (count($sections['summary']) * 24);
            $boxBottom = $cursorY - $boxHeight + 10;
            $content[] = $this->renderPdfFillRect(40, $boxBottom, 515, $boxHeight, '#F8FBFF');
            $content[] = $this->renderPdfTextBlock(['Application Record'], 56, $cursorY - 4, 12, 14, 'F2', self::BRAND_BLUE);

            $rowY = $cursorY - 28;
            foreach ($sections['summary'] as $item) {
                $summaryLine = $item['label'] . ': ' . $item['value'];
                $wrappedSummary = $this->wrapPdfText($summaryLine, 84);
                $content[] = $this->renderPdfTextBlock($wrappedSummary, 56, $rowY, 10, 14, 'F1', self::BRAND_NAVY);
                $rowY -= max(20, count($wrappedSummary) * 14);
            }

            $cursorY = $boxBottom - 20;
        }

        $content[] = $this->renderPdfFillRect(40, 72, 515, 1, '#D7E3EF');
        $content[] = $this->renderPdfTextBlock(
            $this->wrapPdfText('Official communication from the Institution of Engineers Somalia (IES). ' . $this->buildOfficialContactLine(), 86),
            44,
            56,
            9,
            12,
            'F1',
            self::BRAND_STEEL
        );

        return $this->buildPdfDocument($content, $logo, $pageWidth, $pageHeight);
    }

    private function escapePdfText(string $value): string
    {
        return str_replace(
            ['\\', '(', ')'],
            ['\\\\', '\\(', '\\)'],
            $value
        );
    }

    private function buildRightsSectionHtml(bool $showRights, string $rightsHtml): string
    {
        if (! $showRights || $rightsHtml === '') {
            return '';
        }

        return '<tr>'
            . '<td style="padding:0 30px 24px;">'
            . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #dbeafe;border-radius:18px;background:#f8fbff;">'
            . '<tr><td style="padding:16px 18px 8px;font-size:13px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:' . self::BRAND_BLUE . ';">Member Rights And Opportunities</td></tr>'
            . '<tr><td style="padding:0 22px 16px;"><ul style="margin:0;padding-left:18px;">' . $rightsHtml . '</ul></td></tr>'
            . '</table>'
            . '</td>'
            . '</tr>';
    }

    private function buildEmailLogoHtml(): string
    {
        $logoUrl = $this->resolveLogoUrl();

        if ($logoUrl !== null) {
            return '<img src="' . $this->escapeHtml($logoUrl) . '" alt="IES Logo" width="76" style="display:block;width:76px;max-width:76px;height:auto;border:0;outline:none;text-decoration:none;" />';
        }

        return '<div style="display:inline-block;padding:12px 16px;border-radius:18px;background:#ffffff;color:' . self::BRAND_BLUE . ';font-size:24px;font-weight:800;letter-spacing:0.08em;">IES</div>';
    }

    private function resolveLogoUrl(): ?string
    {
        $customLogoUrl = trim($this->env('MAIL_BRAND_LOGO_URL'));

        if ($customLogoUrl !== '') {
            return $customLogoUrl;
        }

        $appUrl = rtrim(trim((string) config('app.url')), '/');

        return $appUrl !== '' ? $appUrl . '/logo-ies.jpg' : null;
    }

    private function resolvePdfLogoAsset(): ?array
    {
        $candidates = [
            base_path('public/logo-ies.jpg'),
            base_path('../frontend/public/logo-ies.jpg'),
        ];

        foreach ($candidates as $candidate) {
            if (! is_file($candidate)) {
                continue;
            }

            $content = @file_get_contents($candidate);
            $dimensions = @getimagesize($candidate);
            if ($content === false || $dimensions === false) {
                continue;
            }

            return [
                'data' => $content,
                'width' => (int) $dimensions[0],
                'height' => (int) $dimensions[1],
            ];
        }

        return null;
    }

    private function parseNotificationText(string $text): array
    {
        $lines = preg_split('/\R/', trim($text)) ?: [];
        $greeting = null;
        $paragraphs = [];
        $summary = [];
        $currentParagraph = [];

        $flushParagraph = function () use (&$currentParagraph, &$paragraphs): void {
            if ($currentParagraph === []) {
                return;
            }

            $paragraphs[] = implode(' ', $currentParagraph);
            $currentParagraph = [];
        };

        foreach ($lines as $rawLine) {
            $line = trim($rawLine);

            if ($line === '') {
                $flushParagraph();
                continue;
            }

            if ($greeting === null) {
                $greeting = $line;
                continue;
            }

            if ($this->isSummaryLine($line)) {
                $flushParagraph();
                [$label, $value] = explode(':', $line, 2);
                $summary[] = [
                    'label' => trim($label),
                    'value' => trim($value),
                ];
                continue;
            }

            $currentParagraph[] = $line;
        }

        $flushParagraph();

        return [
            'greeting' => $greeting,
            'paragraphs' => $paragraphs,
            'summary' => $summary,
        ];
    }

    private function isSummaryLine(string $line): bool
    {
        if (! str_contains($line, ':')) {
            return false;
        }

        [$label, $value] = explode(':', $line, 2);
        $label = trim($label);
        $value = trim($value);

        return $label !== ''
            && $value !== ''
            && in_array($label, self::EMAIL_SUMMARY_LABELS, true);
    }

    private function buildOfficialContactLine(): string
    {
        $replyTo = trim($this->env('SMTP_REPLY_TO'));

        if ($replyTo !== '') {
            return 'Reply-to: ' . $replyTo;
        }

        $from = $this->parseMailbox($this->env('SMTP_FROM'));

        return $from !== null ? 'Official mailbox: ' . $from['address'] : 'Managed by the IES Membership Secretariat';
    }

    private function wrapPdfText(string $text, int $maxChars): array
    {
        $normalized = preg_replace('/\s+/', ' ', trim($text)) ?? trim($text);

        if ($normalized === '') {
            return [''];
        }

        return preg_split('/\R/', wordwrap($normalized, $maxChars, "\n", true)) ?: [$normalized];
    }

    private function renderPdfTextBlock(
        array $lines,
        int $x,
        int $y,
        int $fontSize,
        int $leading,
        string $fontKey,
        string $hexColor
    ): string {
        [$r, $g, $b] = $this->pdfRgb($hexColor);
        $operations = [
            'BT',
            sprintf('/%s %d Tf', $fontKey, $fontSize),
            sprintf('%.3F %.3F %.3F rg', $r, $g, $b),
            sprintf('%d %d Td', $x, $y),
            sprintf('%d TL', $leading),
        ];

        foreach (array_values($lines) as $index => $line) {
            if ($index > 0) {
                $operations[] = 'T*';
            }

            $operations[] = '(' . $this->escapePdfText($line) . ') Tj';
        }

        $operations[] = 'ET';

        return implode("\n", $operations);
    }

    private function renderPdfFillRect(int $x, int $y, int $width, int $height, string $hexColor): string
    {
        [$r, $g, $b] = $this->pdfRgb($hexColor);

        return sprintf(
            "q\n%.3F %.3F %.3F rg\n%d %d %d %d re f\nQ",
            $r,
            $g,
            $b,
            $x,
            $y,
            $width,
            $height
        );
    }

    private function renderPdfImage(string $imageKey, int $x, int $y, int $width, int $height): string
    {
        return sprintf(
            "q\n%d 0 0 %d %d %d cm\n/%s Do\nQ",
            $width,
            $height,
            $x,
            $y,
            $imageKey
        );
    }

    private function buildPdfDocument(array $contentBlocks, ?array $logo, int $pageWidth, int $pageHeight): string
    {
        $content = implode("\n", array_filter($contentBlocks, static fn (?string $block): bool => $block !== null && $block !== ''));
        $resources = '/Font << /F1 5 0 R /F2 6 0 R >>';
        $objects = [
            '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
            '2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj',
        ];

        $imageObjectIndex = null;
        if ($logo !== null) {
            $imageObjectIndex = 7;
            $resources .= ' /XObject << /Im1 7 0 R >>';
        }

        $objects[] = sprintf(
            '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 %d %d] /Contents 4 0 R /Resources << %s >> >> endobj',
            $pageWidth,
            $pageHeight,
            $resources
        );
        $objects[] = "4 0 obj << /Length " . strlen($content) . " >> stream\n{$content}\nendstream\nendobj";
        $objects[] = '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj';
        $objects[] = '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj';

        if ($logo !== null && $imageObjectIndex !== null) {
            $objects[] = sprintf(
                "7 0 obj << /Type /XObject /Subtype /Image /Width %d /Height %d /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length %d >> stream\n%s\nendstream\nendobj",
                $logo['width'],
                $logo['height'],
                strlen($logo['data']),
                $logo['data']
            );
        }

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $object) {
            $offsets[] = strlen($pdf);
            $pdf .= $object . "\n";
        }

        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n";
        $pdf .= '0 ' . (count($objects) + 1) . "\n";
        $pdf .= "0000000000 65535 f \n";

        for ($index = 1; $index <= count($objects); $index++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$index]);
        }

        $pdf .= 'trailer << /Size ' . (count($objects) + 1) . ' /Root 1 0 R >>' . "\n";
        $pdf .= "startxref\n";
        $pdf .= $xrefOffset . "\n";
        $pdf .= "%%EOF";

        return $pdf;
    }

    private function pdfRgb(string $hexColor): array
    {
        $hex = ltrim($hexColor, '#');

        if (strlen($hex) !== 6) {
            return [0, 0, 0];
        }

        return [
            round(hexdec(substr($hex, 0, 2)) / 255, 3),
            round(hexdec(substr($hex, 2, 2)) / 255, 3),
            round(hexdec(substr($hex, 4, 2)) / 255, 3),
        ];
    }

    private function gradeValueFromLabel(string $gradeLabel): string
    {
        $value = array_search($gradeLabel, self::GRADE_LABELS, true);

        return is_string($value) ? $value : MembershipGrade::STUDENT->value;
    }

    private function formatLocalDate($date): string
    {
        return $date->copy()->timezone(config('app.timezone'))->format('n/j/Y');
    }

    private function formatLocalDateTime($date): string
    {
        return $date->copy()->timezone(config('app.timezone'))->format('n/j/Y, g:i:s A');
    }

    private function parsePositiveInt(string $value, int $fallback): int
    {
        if (! preg_match('/^\d+$/', trim($value))) {
            return $fallback;
        }

        $parsed = (int) $value;

        return $parsed > 0 ? $parsed : $fallback;
    }

    private function escapeHtml(string $value): string
    {
        return e($value);
    }

    private function env(string $key, string $default = ''): string
    {
        $value = getenv($key);

        if ($value !== false) {
            return (string) $value;
        }

        if (app()->environment('testing')) {
            return $default;
        }

        if (array_key_exists($key, $_ENV)) {
            return (string) $_ENV[$key];
        }

        if (array_key_exists($key, $_SERVER)) {
            return (string) $_SERVER[$key];
        }

        return $default;
    }
}
