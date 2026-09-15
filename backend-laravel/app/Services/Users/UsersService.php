<?php

namespace App\Services\Users;

use App\Enums\ApplicationDecision;
use App\Enums\ApplicationStage;
use App\Enums\MembershipGrade;
use App\Enums\UserRole;
use App\Exceptions\NestHttpException;
use App\Models\MembershipApplication;
use App\Models\ReviewLog;
use App\Models\User;
use App\Support\Iso8601;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class UsersService
{
    public function listUsers(): array
    {
        $users = User::query()
            ->with([
                'applications' => function ($query): void {
                    $query->withCount('documents')
                        ->orderByDesc('updatedAt')
                        ->select(['id', 'applicantId', 'decision', 'updatedAt']);
                },
            ])
            ->orderByDesc('createdAt')
            ->get(['id', 'username', 'fullName', 'email', 'role', 'createdAt', 'updatedAt']);

        return $users->map(function (User $user): array {
            $applications = $user->applications;

            return [
                'id' => $user->id,
                'username' => $user->username,
                'fullName' => $user->fullName,
                'email' => $user->email,
                'role' => $user->role->value,
                'createdAt' => Iso8601::format($user->createdAt),
                'updatedAt' => Iso8601::format($user->updatedAt),
                'applicationsCount' => $applications->count(),
                'documentsCount' => $applications->sum('documents_count'),
                'registerCount' => $applications->filter(
                    fn (MembershipApplication $application): bool => in_array(
                        $application->decision,
                        [ApplicationDecision::APPROVED, ApplicationDecision::REJECTED],
                        true
                    )
                )->count(),
                'latestActivityAt' => $applications->first()?->updatedAt
                    ? Iso8601::format($applications->first()->updatedAt)
                    : Iso8601::format($user->updatedAt),
            ];
        })->all();
    }

    public function getUser(string $userId): array
    {
        $user = User::query()
            ->with([
                'applications' => function ($query): void {
                    $query->with([
                        'documents' => fn ($documentQuery) => $documentQuery
                            ->select(['id', 'applicationId', 'type', 'fileName', 'createdAt']),
                        'reviews' => fn ($reviewQuery) => $reviewQuery
                            ->orderByDesc('createdAt')
                            ->select(['id', 'applicationId', 'action', 'notes', 'performedBy', 'createdAt']),
                    ])
                    ->orderByDesc('createdAt');
                },
            ])
            ->find($userId, ['id', 'username', 'fullName', 'email', 'role', 'createdAt', 'updatedAt']);

        if (! $user) {
            throw NestHttpException::notFound('User not found');
        }

        $serialized = $this->serializeModel($user);
        $applications = $user->applications;

        $serialized['applicationsCount'] = $applications->count();
        $serialized['documentsCount'] = $applications->sum(
            fn (MembershipApplication $application): int => $application->documents->count()
        );
        $serialized['registerCount'] = $applications->filter(
            fn (MembershipApplication $application): bool => in_array(
                $application->decision,
                [ApplicationDecision::APPROVED, ApplicationDecision::REJECTED],
                true
            )
        )->count();

        return $serialized;
    }

    public function updateRole(string $userId, string $role): array
    {
        return $this->updateUser($userId, ['role' => $role]);
    }

    public function updateUser(string $userId, array $dto): array
    {
        $existing = User::query()->find($userId, ['id', 'role', 'username', 'email', 'fullName']);

        if (! $existing) {
            throw NestHttpException::notFound('User not found');
        }

        $nextRole = array_key_exists('role', $dto) ? UserRole::from($dto['role']) : $existing->role;
        $this->ensureAdminSafetyForRoleChange($userId, $existing->role, $nextRole);

        $nextUsername = array_key_exists('username', $dto)
            ? $this->normalizeUsername($dto['username'])
            : null;
        $nextEmail = array_key_exists('email', $dto)
            ? $this->normalizeEmail($dto['email'])
            : null;

        if ($nextUsername !== null && $nextUsername !== $existing->username) {
            $usernameExists = User::query()
                ->where('username', $nextUsername)
                ->exists();

            if ($usernameExists) {
                throw NestHttpException::badRequest('Username already exists.');
            }
        }

        if ($nextEmail !== null && $nextEmail !== $existing->email) {
            $emailExists = User::query()
                ->where('email', $nextEmail)
                ->exists();

            if ($emailExists) {
                throw NestHttpException::badRequest('Email already exists.');
            }
        }

        try {
            $existing->fill([
                'username' => $nextUsername ?? $existing->username,
                'fullName' => array_key_exists('fullName', $dto) ? trim((string) $dto['fullName']) : $existing->fullName,
                'email' => $nextEmail ?? $existing->email,
                'role' => array_key_exists('role', $dto) ? $nextRole : $existing->role,
            ]);
            $existing->save();
        } catch (QueryException $exception) {
            if ($this->isUniqueConstraintError($exception)) {
                throw NestHttpException::badRequest('Username or email already exists.');
            }

            throw $exception;
        }

        return $this->serializeModel($existing->fresh());
    }

    public function deleteUser(string $userId): array
    {
        $existing = User::query()->find($userId, ['id', 'username', 'email', 'role']);

        if (! $existing) {
            throw NestHttpException::notFound('User not found');
        }

        $this->ensureAdminSafetyForRoleChange($userId, $existing->role, null);

        DB::transaction(function () use ($userId): void {
            MembershipApplication::query()
                ->where('applicantId', $userId)
                ->delete();

            User::query()
                ->where('id', $userId)
                ->delete();
        });

        return [
            'id' => $existing->id,
            'username' => $existing->username,
            'email' => $existing->email,
        ];
    }

    public function deleteAllNonAdminUsers(): array
    {
        $usersToDelete = User::query()
            ->where('role', '!=', UserRole::ADMIN->value)
            ->get(['id', 'username', 'email']);

        if ($usersToDelete->isEmpty()) {
            return [
                'deletedCount' => 0,
                'users' => [],
            ];
        }

        $userIds = $usersToDelete->pluck('id')->all();

        DB::transaction(function () use ($userIds): void {
            MembershipApplication::query()
                ->whereIn('applicantId', $userIds)
                ->delete();

            User::query()
                ->whereIn('id', $userIds)
                ->delete();
        });

        return [
            'deletedCount' => $usersToDelete->count(),
            'users' => $usersToDelete->map(fn (User $user): array => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
            ])->all(),
        ];
    }

    public function createManualRegister(string $userId, array $dto, string $performedBy): array
    {
        $user = User::query()->find($userId, ['id', 'fullName', 'email']);

        if (! $user) {
            throw NestHttpException::notFound('User not found');
        }

        $validUntil = array_key_exists('validUntil', $dto) && $dto['validUntil'] !== null
            ? CarbonImmutable::parse($dto['validUntil'])
            : CarbonImmutable::create(
                now()->year + 1,
                now()->month,
                now()->day,
                0,
                0,
                0,
                now()->getTimezone()
            );

        $lastError = null;

        for ($attempt = 0; $attempt < 3; $attempt++) {
            $numbers = $this->buildRegisterNumbers();

            try {
                /** @var MembershipApplication $application */
                $application = DB::transaction(function () use ($user, $dto, $performedBy, $validUntil, $numbers): MembershipApplication {
                    $application = MembershipApplication::query()->create([
                        'applicantId' => $user->id,
                        'fullName' => $user->fullName,
                        'email' => $user->email,
                        'phone' => trim((string) $dto['phone']),
                        'nationalIdNumber' => trim((string) $dto['nationalIdNumber']),
                        'membershipGrade' => MembershipGrade::from($dto['membershipGrade']),
                        'organizationName' => array_key_exists('organizationName', $dto) && trim((string) $dto['organizationName']) !== ''
                            ? trim((string) $dto['organizationName'])
                            : null,
                        'yearsOfExperience' => $dto['yearsOfExperience'] ?? null,
                        'declarationAccepted' => true,
                        'bio' => array_key_exists('bio', $dto) && trim((string) $dto['bio']) !== ''
                            ? trim((string) $dto['bio'])
                            : null,
                        'stage' => ApplicationStage::REGISTERED,
                        'decision' => ApplicationDecision::APPROVED,
                        'registrationNumber' => $numbers['registrationNumber'],
                        'certificateNumber' => $numbers['certificateNumber'],
                        'validUntil' => $validUntil,
                    ]);

                    ReviewLog::query()->create([
                        'applicationId' => $application->id,
                        'action' => 'ADMIN_MANUAL_REGISTER',
                        'notes' => array_key_exists('notes', $dto) && trim((string) $dto['notes']) !== ''
                            ? trim((string) $dto['notes'])
                            : 'Manual register entry created by admin',
                        'performedBy' => $performedBy,
                    ]);

                    ReviewLog::query()->create([
                        'applicationId' => $application->id,
                        'action' => 'DECISION_APPROVED',
                        'notes' => 'Approved during manual register creation',
                        'performedBy' => $performedBy,
                    ]);

                    return $application->load(['documents', 'reviews']);
                });

                return $this->serializeModel($application);
            } catch (\Throwable $exception) {
                $lastError = $exception;
            }
        }

        if ($lastError instanceof \Throwable) {
            throw $lastError;
        }

        throw NestHttpException::badRequest('Unable to create register entry, please retry.');
    }

    private function ensureAdminSafetyForRoleChange(string $userId, UserRole $currentRole, ?UserRole $nextRole): void
    {
        if ($currentRole !== UserRole::ADMIN || $nextRole === UserRole::ADMIN) {
            return;
        }

        $otherAdminCount = User::query()
            ->where('role', UserRole::ADMIN->value)
            ->where('id', '!=', $userId)
            ->count();

        if ($otherAdminCount === 0) {
            throw NestHttpException::badRequest('At least one admin account is required');
        }
    }

    private function buildRegisterNumbers(): array
    {
        $year = now()->year;
        $registrationSuffix = strtoupper(substr(bin2hex(random_bytes(16)), 0, 6));
        $certificateSuffix = strtoupper(substr(bin2hex(random_bytes(16)), 0, 8));

        return [
            'registrationNumber' => "IES-SOM-{$year}-{$registrationSuffix}",
            'certificateNumber' => "CERT-{$year}-{$certificateSuffix}",
        ];
    }

    private function normalizeUsername(string $value): string
    {
        $normalized = preg_replace('/\s+/', ' ', trim($value)) ?? trim($value);

        return strtolower($normalized);
    }

    private function normalizeEmail(string $value): string
    {
        return strtolower(trim($value));
    }

    private function isUniqueConstraintError(QueryException $exception): bool
    {
        $errorInfo = $exception->errorInfo;

        if (! is_array($errorInfo)) {
            return false;
        }

        return ($errorInfo[0] ?? null) === '23000' || ($errorInfo[1] ?? null) === 1062;
    }

    private function serializeModel($model): array
    {
        return json_decode(json_encode($model, JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
    }
}
