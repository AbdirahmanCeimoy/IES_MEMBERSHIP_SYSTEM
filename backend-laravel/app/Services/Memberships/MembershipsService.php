<?php

namespace App\Services\Memberships;

use App\Enums\ApplicationDecision;
use App\Enums\ApplicationStage;
use App\Enums\MembershipGrade;
use App\Enums\RenewalStatus;
use App\Enums\UserRole;
use App\Exceptions\NestHttpException;
use App\Models\DisciplinaryAction;
use App\Models\MembershipApplication;
use App\Models\MembershipDocument;
use App\Models\Renewal;
use App\Models\ReviewLog;
use App\Support\Iso8601;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MembershipsService
{
    public function __construct(
        private readonly MembershipNotificationService $membershipNotificationService,
        private readonly MembershipDocumentStorage $membershipDocumentStorage
    ) {
    }

    public function createApplication(string $userId, array $dto): array
    {
        if (! $dto['declarationAccepted']) {
            throw NestHttpException::badRequest('Declaration must be accepted.');
        }

        $normalizedEmail = $this->normalizeEmail($dto['email']);
        $normalizedNationalId = $this->normalizeNationalId($dto['nationalIdNumber']);

        $duplicateApplication = MembershipApplication::query()
            ->where('email', $normalizedEmail)
            ->orWhere('nationalIdNumber', $normalizedNationalId)
            ->first(['id', 'email', 'nationalIdNumber']);

        if ($duplicateApplication) {
            if ($duplicateApplication->email === $normalizedEmail) {
                throw NestHttpException::badRequest(
                    'This email is already used in another application.'
                );
            }

            if ($duplicateApplication->nationalIdNumber === $normalizedNationalId) {
                throw NestHttpException::badRequest(
                    'This National ID is already used in another application.'
                );
            }
        }

        /** @var MembershipApplication $application */
        $application = DB::transaction(function () use ($userId, $dto, $normalizedEmail, $normalizedNationalId) {
            $application = MembershipApplication::query()->create([
                'applicantId' => $userId,
                'fullName' => $dto['fullName'],
                'email' => $normalizedEmail,
                'phone' => $dto['phone'],
                'nationalIdNumber' => $normalizedNationalId,
                'membershipGrade' => $dto['membershipGrade'],
                'organizationName' => $dto['organizationName'],
                'yearsOfExperience' => $dto['yearsOfExperience'],
                'declarationAccepted' => $dto['declarationAccepted'],
                'bio' => $dto['bio'],
            ]);

            foreach ($dto['documents'] as $document) {
                MembershipDocument::query()->create([
                    'applicationId' => $application->id,
                    'type' => $document['type'],
                    'fileName' => $document['fileName'],
                ]);
            }

            ReviewLog::query()->create([
                'applicationId' => $application->id,
                'action' => 'SUBMITTED',
                'notes' => 'Application submitted by applicant',
                'performedBy' => $userId,
            ]);

            return $application->load('documents');
        });

        try {
            $this->membershipNotificationService->sendSubmissionEmail([
                'applicationId' => $application->id,
                'fullName' => $application->fullName,
                'email' => $application->email,
                'membershipGrade' => $application->membershipGrade,
                'createdAt' => $application->createdAt,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Submission email notification failed for application ' . $application->id . ': ' . $exception->getMessage());

            try {
                $application->delete();
            } catch (\Throwable $cleanupException) {
                Log::error(
                    'Failed to rollback application '
                    . $application->id
                    . ' after email failure: '
                    . $cleanupException->getMessage()
                );
            }

            $this->deleteUploadedFiles(array_map(
                static fn (array $document): string => $document['fileName'],
                $dto['documents']
            ));

            throw NestHttpException::internalServerError(
                'Application was not submitted because the confirmation email could not be delivered. Please try again after email delivery is working.'
            );
        }

        return $this->serializeModel($application);
    }

    public function listApplications(): array
    {
        return $this->serializeCollection(
            MembershipApplication::query()
                ->with(['documents', 'reviews', 'renewals'])
                ->orderByDesc('createdAt')
                ->get()
        );
    }

    public function listOwnApplications(string $userId): array
    {
        return $this->serializeCollection(
            MembershipApplication::query()
                ->where('applicantId', $userId)
                ->with(['documents', 'reviews', 'renewals', 'disciplinary'])
                ->orderByDesc('createdAt')
                ->get()
        );
    }

    public function getApplication(string $id): MembershipApplication
    {
        $application = MembershipApplication::query()
            ->with(['documents', 'reviews', 'renewals', 'disciplinary'])
            ->find($id);

        if (! $application) {
            throw NestHttpException::notFound('Application not found');
        }

        return $application;
    }

    public function getOwnApplication(string $id, string $userId): array
    {
        $application = $this->getApplication($id);

        if ($application->applicantId !== $userId) {
            throw NestHttpException::forbidden('You are not allowed to access this application');
        }

        return $this->serializeModel($application);
    }

    public function getApplicationDocument(string $applicationId, string $documentId, array $actor): MembershipDocument
    {
        $application = MembershipApplication::query()
            ->select(['id', 'applicantId'])
            ->find($applicationId);

        if (! $application) {
            throw NestHttpException::notFound('Application not found');
        }

        $isAdmin = $this->isAdminRole($actor['role'] ?? null);
        $isOwner = $application->applicantId === ($actor['sub'] ?? null);

        if (! $isAdmin && ! $isOwner) {
            throw NestHttpException::forbidden('You are not allowed to access this document');
        }

        $document = MembershipDocument::query()
            ->where('id', $documentId)
            ->where('applicationId', $applicationId)
            ->first();

        if (! $document) {
            throw NestHttpException::notFound('Document not found');
        }

        return $document;
    }

    public function deleteApplicationDocument(string $applicationId, string $documentId): array
    {
        $this->getApplication($applicationId);

        $document = MembershipDocument::query()
            ->where('id', $documentId)
            ->where('applicationId', $applicationId)
            ->first(['id', 'type', 'fileName']);

        if (! $document) {
            throw NestHttpException::notFound('Document not found');
        }

        $documentArray = $this->serializeModel($document);
        $document->delete();

        try {
            $this->membershipDocumentStorage->delete($document->fileName);
        } catch (\Throwable) {
            // Keep DB deletion successful even if local file cleanup fails.
        }

        return $documentArray;
    }

    public function updateStage(string $id, array $dto, string $performedBy): array
    {
        $application = $this->getApplication($id);
        $application->stage = ApplicationStage::from($dto['stage']);
        $application->save();

        ReviewLog::query()->create([
            'applicationId' => $application->id,
            'action' => 'STAGE_' . $dto['stage'],
            'notes' => $dto['notes'] ?? null,
            'performedBy' => $performedBy,
        ]);

        return $this->serializeModel($application->fresh());
    }

    public function setDecision(string $id, array $dto, string $performedBy): array
    {
        $application = $this->getApplication($id);
        $decision = ApplicationDecision::from($dto['decision']);
        $decisionTimestamp = now();
        $isFirstApproval = $decision === ApplicationDecision::APPROVED
            && $application->decision !== ApplicationDecision::APPROVED;

        if ($decision === ApplicationDecision::APPROVED) {
            $year = $decisionTimestamp->year;
            $registrationNumber = 'IES-SOM-' . $year . '-' . strtoupper(substr($application->id, -6));
            $certificateNumber = 'CERT-' . $year . '-' . strtoupper(substr($application->id, -8));
            $validUntil = $this->rollValidityDate($decisionTimestamp);

            if ($isFirstApproval) {
                $this->membershipNotificationService->sendApprovalEmail([
                    'applicationId' => $application->id,
                    'fullName' => $application->fullName,
                    'email' => $application->email,
                    'membershipGrade' => $application->membershipGrade,
                    'registrationNumber' => $registrationNumber,
                    'certificateNumber' => $certificateNumber,
                    'validUntil' => $validUntil,
                    'decidedAt' => $decisionTimestamp,
                ]);
            }

            $application->registrationNumber = $registrationNumber;
            $application->certificateNumber = $certificateNumber;
            $application->validUntil = $validUntil;
            $application->stage = ApplicationStage::REGISTERED;
        }

        if ($decision === ApplicationDecision::REJECTED) {
            $this->membershipNotificationService->sendRejectionEmail([
                'applicationId' => $application->id,
                'fullName' => $application->fullName,
                'email' => $application->email,
                'membershipGrade' => $application->membershipGrade,
                'rejectionReason' => $dto['notes'] ?? '',
                'decidedAt' => $decisionTimestamp,
            ]);
        }

        $application->decision = $decision;
        $application->rejectionReason = $decision === ApplicationDecision::REJECTED
            ? ($dto['notes'] ?? '')
            : null;
        $application->save();

        ReviewLog::query()->create([
            'applicationId' => $application->id,
            'action' => 'DECISION_' . $decision->value,
            'notes' => $dto['notes'] ?? null,
            'performedBy' => $performedBy,
        ]);

        return $this->serializeModel($application->fresh());
    }

    public function renew(string $id, array $dto, string $performedBy): array
    {
        $application = $this->getApplication($id);

        if ($application->decision !== ApplicationDecision::APPROVED) {
            throw NestHttpException::badRequest('Only approved members can renew.');
        }

        $baseDate = $application->validUntil ?? now();
        $approvedUntil = ($dto['feePaid'] ?? false)
            ? $this->rollValidityDate($baseDate)
            : null;

        $renewal = Renewal::query()->create([
            'applicationId' => $application->id,
            'cpdCredits' => $dto['cpdCredits'],
            'feePaid' => $dto['feePaid'],
            'status' => ($dto['feePaid'] ?? false) ? RenewalStatus::APPROVED : RenewalStatus::PENDING,
            'decisionNotes' => $dto['notes'] ?? null,
            'approvedUntil' => $approvedUntil,
        ]);

        if ($dto['feePaid']) {
            $application->validUntil = $renewal->approvedUntil;
            $application->save();

            ReviewLog::query()->create([
                'applicationId' => $application->id,
                'action' => 'RENEWAL_APPROVED',
                'notes' => $dto['notes'] ?? null,
                'performedBy' => $performedBy,
            ]);
        }

        return $this->serializeModel($renewal);
    }

    public function upgrade(string $id, array $dto, string $performedBy): array
    {
        $application = $this->getApplication($id);
        $application->membershipGrade = MembershipGrade::from($dto['membershipGrade']);
        $application->stage = ApplicationStage::TECHNICAL_REVIEW;
        $application->save();

        ReviewLog::query()->create([
            'applicationId' => $application->id,
            'action' => 'UPGRADE_REQUESTED_' . $dto['membershipGrade'],
            'notes' => $dto['notes'] ?? null,
            'performedBy' => $performedBy,
        ]);

        return $this->serializeModel($application->fresh());
    }

    public function addDisciplinary(string $id, array $dto, string $createdBy): array
    {
        $this->getApplication($id);

        $disciplinary = DisciplinaryAction::query()->create([
            'applicationId' => $id,
            'type' => $dto['type'],
            'reason' => $dto['reason'],
            'endDate' => $dto['endDate'] ?? null,
            'createdBy' => $createdBy,
        ]);

        return $this->serializeModel($disciplinary);
    }

    public function officialRegister(): array
    {
        return $this->serializeCollection(
            MembershipApplication::query()
                ->whereIn('decision', [ApplicationDecision::APPROVED->value, ApplicationDecision::REJECTED->value])
                ->select([
                    'id',
                    'fullName',
                    'email',
                    'membershipGrade',
                    'decision',
                    'rejectionReason',
                    'registrationNumber',
                    'certificateNumber',
                    'validUntil',
                ])
                ->orderByDesc('updatedAt')
                ->get()
        );
    }

    public function verifyMembershipPublic(array $lookup): array
    {
        $registrationNumber = $this->normalizeLookup($lookup['registrationNumber'] ?? null);
        $certificateNumber = $this->normalizeLookup($lookup['certificateNumber'] ?? null);

        if (! $registrationNumber && ! $certificateNumber) {
            throw NestHttpException::badRequest('Provide registrationNumber or certificateNumber');
        }

        $query = MembershipApplication::query()
            ->where('decision', ApplicationDecision::APPROVED->value)
            ->select([
                'fullName',
                'membershipGrade',
                'registrationNumber',
                'certificateNumber',
                'validUntil',
            ]);

        if ($registrationNumber && $certificateNumber) {
            $query->where(function ($builder) use ($registrationNumber, $certificateNumber): void {
                $builder->where('registrationNumber', $registrationNumber)
                    ->orWhere('certificateNumber', $certificateNumber);
            });
        } elseif ($registrationNumber) {
            $query->where('registrationNumber', $registrationNumber);
        } else {
            $query->where('certificateNumber', $certificateNumber);
        }

        $member = $query->first();

        if (! $member) {
            return [
                'verified' => false,
                'member' => null,
            ];
        }

        $isActive = $member->validUntil !== null ? $member->validUntil->gte(now()) : false;

        return [
            'verified' => true,
            'member' => [
                'fullName' => $member->fullName,
                'membershipGrade' => $member->membershipGrade->value,
                'registrationNumber' => $member->registrationNumber,
                'certificateNumber' => $member->certificateNumber,
                'validUntil' => $member->validUntil ? Iso8601::format($member->validUntil) : null,
                'status' => $isActive ? 'ACTIVE' : 'EXPIRED',
            ],
        ];
    }

    public function certificateData(string $id, array $actor): array
    {
        $application = $this->getApplication($id);
        $isAdmin = $this->isAdminRole($actor['role'] ?? null);
        $isOwner = $application->applicantId === ($actor['sub'] ?? null);

        if (! $isAdmin && ! $isOwner) {
            throw NestHttpException::forbidden('You are not allowed to access this certificate');
        }

        if ($application->decision !== ApplicationDecision::APPROVED) {
            throw NestHttpException::badRequest('Certificate is available only after approval.');
        }

        return [
            'memberName' => $application->fullName,
            'grade' => $application->membershipGrade->value,
            'registrationNumber' => $application->registrationNumber,
            'certificateNumber' => $application->certificateNumber,
            'issuedDate' => Iso8601::format($application->updatedAt),
            'validUntil' => $application->validUntil ? Iso8601::format($application->validUntil) : null,
        ];
    }

    public function deleteApplication(string $id): array
    {
        $application = $this->getApplication($id);
        $response = [
            'id' => $application->id,
            'fullName' => $application->fullName,
            'email' => $application->email,
        ];

        $application->delete();

        return $response;
    }

    private function normalizeEmail(string $value): string
    {
        return strtolower(trim($value));
    }

    private function normalizeNationalId(string $value): string
    {
        return trim($value);
    }

    private function normalizeLookup(?string $value): ?string
    {
        $normalized = $value !== null ? strtoupper(trim($value)) : null;

        return $normalized !== null && $normalized !== '' ? $normalized : null;
    }

    private function isAdminRole(UserRole|string|null $role): bool
    {
        if ($role instanceof UserRole) {
            return $role === UserRole::ADMIN;
        }

        return is_string($role) && strtoupper(trim($role)) === UserRole::ADMIN->value;
    }

    private function deleteUploadedFiles(array $fileNames): void
    {
        foreach (array_unique(array_map('basename', $fileNames)) as $fileName) {
            try {
                $this->membershipDocumentStorage->delete($fileName);
            } catch (\Throwable $exception) {
                Log::error('Failed to remove uploaded file ' . $fileName . ': ' . $exception->getMessage());
            }
        }
    }

    private function rollValidityDate(\DateTimeInterface $date): CarbonImmutable
    {
        return CarbonImmutable::create(
            ((int) $date->format('Y')) + 1,
            (int) $date->format('n'),
            (int) $date->format('j'),
            0,
            0,
            0,
            $date->getTimezone()
        );
    }

    private function serializeCollection(iterable $items): array
    {
        $output = [];

        foreach ($items as $item) {
            $output[] = $this->serializeModel($item);
        }

        return $output;
    }

    private function serializeModel($model): array
    {
        return json_decode(json_encode($model, JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
    }
}
