<?php

namespace App\Services\Auth;

use App\Enums\UserRole;
use App\Exceptions\NestHttpException;
use App\Models\MembershipApplication;
use App\Models\User;
use App\Services\Auth\PasswordResetService;
use App\Services\Memberships\WelcomeEmailService;
use App\Support\Iso8601;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuthService
{
    private const PROFILE_UPDATE_COOLDOWN_MONTHS = 2;

    public function __construct(
        private readonly JwtTokenService $jwtTokenService,
        private readonly WelcomeEmailService $welcomeEmailService,
        private readonly PasswordResetService $passwordResetService
    ) {
    }

    /** Generate a 6-digit OTP, store it, and email it to the user. */
    public function requestPasswordReset(string $email): array
    {
        $email = $this->normalizeEmail($email);
        if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => true,
                'message' => 'If an account exists, a code has been sent to the email.',
            ];
        }

        $user = User::query()->where('email', $email)->first();
        if ($user) {
            $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->passwordResetToken = hash('sha256', $otp . '|' . $user->email);
            $user->passwordResetExpiresAt = CarbonImmutable::now()->addMinutes(10);
            $user->save();

            // Log OTP in dev so testing works without SMTP.
            Log::info('Password reset OTP for ' . $user->email . ': ' . $otp);

            try {
                $this->passwordResetService->sendResetEmail([
                    'email' => $user->email,
                    'fullName' => $user->fullName ?: $user->username,
                    'otp' => $otp,
                ]);
            } catch (Throwable $exception) {
                Log::warning('Password reset email failed for ' . $user->email . ': ' . $exception->getMessage());
            }
        }

        return [
            'success' => true,
            'message' => 'If an account exists, a code has been sent to the email.',
        ];
    }

    /** Verify OTP code for the given email. Returns a short-lived confirmation token. */
    public function verifyPasswordResetOtp(string $email, string $otp): array
    {
        $email = $this->normalizeEmail($email);
        $otp = trim($otp);
        if ($email === '' || ! preg_match('/^\d{6}$/', $otp)) {
            throw NestHttpException::badRequest('Invalid email or code.');
        }

        $user = User::query()->where('email', $email)->first();
        if (! $user || ! $user->passwordResetToken || ! $user->passwordResetExpiresAt) {
            throw NestHttpException::badRequest('Invalid or expired code.');
        }
        if ($user->passwordResetExpiresAt->lt(now())) {
            throw NestHttpException::badRequest('This code has expired. Please request a new one.');
        }

        $hashedOtp = hash('sha256', $otp . '|' . $user->email);
        if (! hash_equals($user->passwordResetToken, $hashedOtp)) {
            throw NestHttpException::badRequest('The code you entered is incorrect.');
        }

        // Rotate token to a one-time confirmation token used to complete reset.
        $confirmationToken = bin2hex(random_bytes(24));
        $user->passwordResetToken = hash('sha256', 'CONFIRMED|' . $confirmationToken);
        // Give the user 10 more minutes to enter a new password.
        $user->passwordResetExpiresAt = CarbonImmutable::now()->addMinutes(10);
        $user->save();

        return [
            'success' => true,
            'token' => $confirmationToken,
        ];
    }

    /** Finalize the reset using the confirmation token from OTP verification. */
    public function resetPasswordWithToken(string $token, string $newPassword): array
    {
        $token = trim($token);
        if ($token === '' || strlen($token) < 32) {
            throw NestHttpException::badRequest('Invalid or expired session.');
        }

        if (! preg_match(\App\Support\AuthValidation::SECURE_PASSWORD_REGEX, $newPassword)) {
            throw NestHttpException::badRequest(\App\Support\AuthValidation::SECURE_PASSWORD_ERROR);
        }

        $hashedToken = hash('sha256', 'CONFIRMED|' . $token);
        $user = User::query()->where('passwordResetToken', $hashedToken)->first();

        if (! $user) {
            throw NestHttpException::badRequest('Invalid or expired session.');
        }

        if (! $user->passwordResetExpiresAt || $user->passwordResetExpiresAt->lt(now())) {
            throw NestHttpException::badRequest('Your session has expired. Please start over.');
        }

        $user->passwordHash = Hash::make($newPassword);
        $user->passwordResetToken = null;
        $user->passwordResetExpiresAt = null;
        $user->save();

        return [
            'success' => true,
            'message' => 'Password reset successful. You can now sign in with your new password.',
        ];
    }

    public function signup(array $dto): array
    {
        $normalizedUsername = $this->normalizeUsername($dto['username']);
        $normalizedEmail = $this->normalizeEmail($dto['email']);

        $existing = User::query()
            ->where('username', $normalizedUsername)
            ->orWhere('email', $normalizedEmail)
            ->first();

        if ($existing) {
            throw NestHttpException::badRequest('Username or email already exists.');
        }

        try {
            $user = User::query()->create([
                'username' => $normalizedUsername,
                'passwordHash' => Hash::make($dto['password']),
                'fullName' => $dto['fullName'],
                'email' => $normalizedEmail,
                'role' => UserRole::MEMBER,
            ]);
        } catch (QueryException $exception) {
            if ($this->isUniqueConstraintError($exception)) {
                throw NestHttpException::badRequest('Username or email already exists.');
            }

            throw $exception;
        }

        // Fire welcome email asynchronously - do NOT block signup on it.
        try {
            $this->welcomeEmailService->sendWelcomeEmail([
                'fullName' => $user->fullName ?: $user->username,
                'email' => $user->email,
                'username' => $user->username,
                'grade' => $dto['grade'] ?? null,
            ]);
        } catch (Throwable $exception) {
            Log::warning('Welcome email failed for ' . $user->email . ': ' . $exception->getMessage());
        }

        return [
            'token' => $this->jwtTokenService->issue($user),
            'user' => $this->safeUser($user),
        ];
    }

    public function login(array $dto): array
    {
        $identifier = trim((string) $dto['username']);
        $normalizedUsername = $this->normalizeUsername($identifier);

        // Accept EITHER a username OR an email (identified by '@').
        $user = null;
        if (str_contains($identifier, '@')) {
            $normalizedEmail = $this->normalizeEmail($identifier);
            $user = User::query()->where('email', $normalizedEmail)->first();
        }
        if (! $user) {
            $user = User::query()->where('username', $normalizedUsername)->first();
        }

        if (! $user || ! Hash::check($dto['password'], $user->passwordHash)) {
            throw NestHttpException::unauthorized('Invalid username/email or password.');
        }

        return [
            'token' => $this->jwtTokenService->issue($user),
            'user' => $this->safeUser($user),
        ];
    }

    public function me(string $userId): array
    {
        $user = User::query()
            ->select(['id', 'username', 'fullName', 'email', 'role', 'createdAt', 'updatedAt'])
            ->find($userId);

        if (! $user) {
            throw NestHttpException::unauthorized('User not found');
        }

        return [
            'user' => $this->safeUserWithTimestamps($user),
        ];
    }

    public function updateMe(string $userId, array $dto): array
    {
        $existing = User::query()
            ->select(['id', 'username', 'fullName', 'email', 'role', 'createdAt', 'updatedAt'])
            ->find($userId);

        if (! $existing) {
            throw NestHttpException::unauthorized('User not found');
        }

        $nextUsername = array_key_exists('username', $dto)
            ? $this->normalizeUsername($dto['username'])
            : null;
        $nextFullName = array_key_exists('fullName', $dto)
            ? trim((string) $dto['fullName'])
            : null;
        $nextEmail = array_key_exists('email', $dto)
            ? $this->normalizeEmail($dto['email'])
            : null;

        $hasUsernameChange = $nextUsername !== null && $nextUsername !== $existing->username;
        $hasFullNameChange = $nextFullName !== null && $nextFullName !== $existing->fullName;
        $hasEmailChange = $nextEmail !== null && $nextEmail !== $existing->email;
        $hasAnyChange = $hasUsernameChange || $hasFullNameChange || $hasEmailChange;

        $nextProfileUpdateAt = $this->addMonths($existing->updatedAt, self::PROFILE_UPDATE_COOLDOWN_MONTHS);
        $isFirstSelfEditWindow = abs($existing->updatedAt->getTimestampMs() - $existing->createdAt->getTimestampMs()) < 1000;

        if (! $hasAnyChange) {
            return [
                'user' => $this->safeUserWithTimestamps($existing),
                'nextProfileUpdateAt' => Iso8601::format($nextProfileUpdateAt),
            ];
        }

        if (! $isFirstSelfEditWindow && now()->lt($nextProfileUpdateAt)) {
            throw NestHttpException::badRequest(
                'Profile can be updated once every 2 months. Next update is available on '
                . $nextProfileUpdateAt->format('Y-m-d')
                . '.'
            );
        }

        if ($hasUsernameChange && User::query()->where('username', $nextUsername)->exists()) {
            throw NestHttpException::badRequest('Username already exists.');
        }

        if ($hasEmailChange && User::query()->where('email', $nextEmail)->exists()) {
            throw NestHttpException::badRequest('Email already exists.');
        }

        try {
            $existing->fill([
                'username' => $hasUsernameChange ? $nextUsername : $existing->username,
                'fullName' => $hasFullNameChange ? $nextFullName : $existing->fullName,
                'email' => $hasEmailChange ? $nextEmail : $existing->email,
            ]);
            // Persist additional profile fields when the migration has added them.
            foreach (['gender', 'title', 'firstName', 'lastName', 'dateOfBirth', 'discipline', 'grade'] as $extra) {
                if (array_key_exists($extra, $dto) && $dto[$extra] !== null) {
                    try {
                        $existing->{$extra} = $extra === 'gender'
                            ? strtoupper((string) $dto[$extra])
                            : $dto[$extra];
                    } catch (\Throwable) {
                        // ignore if column not present yet
                    }
                }
            }
            $existing->save();
        } catch (QueryException $exception) {
            if ($this->isUniqueConstraintError($exception)) {
                throw NestHttpException::badRequest('Username or email already exists.');
            }

            throw $exception;
        }

        $existing->refresh();

        return [
            'user' => $this->safeUserWithTimestamps($existing),
            'nextProfileUpdateAt' => Iso8601::format(
                $this->addMonths($existing->updatedAt, self::PROFILE_UPDATE_COOLDOWN_MONTHS)
            ),
        ];
    }

    public function updateMyPassword(string $userId, array $dto): array
    {
        $existing = User::query()
            ->select(['id', 'passwordHash', 'createdAt', 'updatedAt'])
            ->find($userId);

        if (! $existing) {
            throw NestHttpException::unauthorized('User not found');
        }

        if (! Hash::check($dto['currentPassword'], $existing->passwordHash)) {
            throw NestHttpException::badRequest('Current password is incorrect.');
        }

        if (Hash::check($dto['newPassword'], $existing->passwordHash)) {
            throw NestHttpException::badRequest(
                'New password must be different from current password.'
            );
        }

        $nextProfileUpdateAt = $this->addMonths($existing->updatedAt, self::PROFILE_UPDATE_COOLDOWN_MONTHS);
        $isFirstSelfEditWindow = abs($existing->updatedAt->getTimestampMs() - $existing->createdAt->getTimestampMs()) < 1000;

        if (! $isFirstSelfEditWindow && now()->lt($nextProfileUpdateAt)) {
            throw NestHttpException::badRequest(
                'Password can be updated once every 2 months. Next update is available on '
                . $nextProfileUpdateAt->format('Y-m-d')
                . '.'
            );
        }

        $existing->passwordHash = Hash::make($dto['newPassword']);
        $existing->save();
        $existing->refresh();

        return [
            'message' => 'Password updated successfully.',
            'nextProfileUpdateAt' => Iso8601::format(
                $this->addMonths($existing->updatedAt, self::PROFILE_UPDATE_COOLDOWN_MONTHS)
            ),
        ];
    }

    public function finalizeCredentials(string $userId, array $dto): array
    {
        $existing = User::query()
            ->select(['id', 'username', 'fullName', 'email', 'role', 'createdAt', 'updatedAt'])
            ->find($userId);

        if (! $existing) {
            throw NestHttpException::unauthorized('User not found');
        }

        $isFirstSelfEditWindow = abs($existing->updatedAt->getTimestampMs() - $existing->createdAt->getTimestampMs()) < 1000;

        if (! $isFirstSelfEditWindow) {
            throw NestHttpException::badRequest(
                'Credential setup window has expired. Please use dashboard profile/password update.'
            );
        }

        $nextUsername = $this->normalizeUsername($dto['username']);
        $nextFullName = array_key_exists('fullName', $dto) && trim((string) $dto['fullName']) !== ''
            ? trim((string) $dto['fullName'])
            : $existing->fullName;
        $nextEmail = array_key_exists('email', $dto)
            ? $this->normalizeEmail($dto['email'])
            : $existing->email;

        if ($nextUsername !== $existing->username && User::query()->where('username', $nextUsername)->exists()) {
            throw NestHttpException::badRequest('Username already exists.');
        }

        if ($nextEmail !== $existing->email && User::query()->where('email', $nextEmail)->exists()) {
            throw NestHttpException::badRequest('Email already exists.');
        }

        try {
            $existing->fill([
                'username' => $nextUsername,
                'fullName' => $nextFullName,
                'email' => $nextEmail,
                'passwordHash' => Hash::make($dto['newPassword']),
            ]);
            $existing->save();
        } catch (QueryException $exception) {
            if ($this->isUniqueConstraintError($exception)) {
                throw NestHttpException::badRequest('Username or email already exists.');
            }

            throw $exception;
        }

        $existing->refresh();

        return [
            'user' => $this->safeUserWithTimestamps($existing),
        ];
    }

    public function resetPasswordWithValidation(array $dto): array
    {
        $normalizedUsername = $this->normalizeUsername($dto['username']);
        $normalizedFullName = $this->normalizeFullName($dto['fullName']);
        $normalizedEmail = array_key_exists('email', $dto)
            ? $this->normalizeEmail($dto['email'])
            : null;
        $normalizedNationalId = array_key_exists('nationalIdNumber', $dto)
            ? $this->normalizeNationalId($dto['nationalIdNumber'])
            : null;

        $user = User::query()
            ->select(['id', 'passwordHash', 'role', 'fullName', 'email'])
            ->where('username', $normalizedUsername)
            ->first();

        if (! $user) {
            throw NestHttpException::badRequest('Unable to validate account recovery details.');
        }

        $hasMatchingFullName = $this->normalizeFullName($user->fullName) === $normalizedFullName;
        $hasMatchingEmail = $normalizedEmail !== null
            && $this->normalizeEmail($user->email) === $normalizedEmail;

        if ($user->role === UserRole::ADMIN) {
            if (! $hasMatchingFullName || ! $hasMatchingEmail) {
                throw NestHttpException::badRequest(
                    'Unable to validate admin account recovery details.'
                );
            }
        } else {
            if ($normalizedNationalId === null) {
                throw NestHttpException::badRequest(
                    'National ID / Passport is required for membership account recovery.'
                );
            }

            $relatedApplications = MembershipApplication::query()
                ->where('applicantId', $user->id)
                ->orderByDesc('createdAt')
                ->limit(10)
                ->get(['fullName', 'nationalIdNumber']);

            $hasMatchingApplication = $relatedApplications->contains(
                fn (MembershipApplication $application): bool => $this->normalizeFullName($application->fullName) === $normalizedFullName
                    && $this->normalizeNationalId($application->nationalIdNumber) === $normalizedNationalId
            );

            if (! $hasMatchingApplication) {
                throw NestHttpException::badRequest('Unable to validate account recovery details.');
            }
        }

        if (Hash::check($dto['newPassword'], $user->passwordHash)) {
            throw NestHttpException::badRequest(
                'New password must be different from current password.'
            );
        }

        $user->passwordHash = Hash::make($dto['newPassword']);
        $user->save();

        return [
            'message' => 'Password reset successful. Please login with your new password.',
        ];
    }

    private function safeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'fullName' => $user->fullName,
            'email' => $user->email,
            'role' => $user->role->value,
        ];
    }

    private function safeUserWithTimestamps(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'fullName' => $user->fullName,
            'email' => $user->email,
            'role' => $user->role->value,
            'createdAt' => Iso8601::format($user->createdAt),
            'updatedAt' => Iso8601::format($user->updatedAt),
        ];
    }

    private function normalizeUsername(string $value): string
    {
        $normalized = preg_replace('/\s+/', ' ', trim($value)) ?? trim($value);

        return mb_strtolower($normalized);
    }

    private function normalizeEmail(string $value): string
    {
        return mb_strtolower(trim($value));
    }

    private function normalizeFullName(string $value): string
    {
        return mb_strtolower(trim(preg_replace('/\s+/', ' ', $value) ?? $value));
    }

    private function normalizeNationalId(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return mb_strtoupper(str_replace(' ', '', trim($value)));
    }

    private function addMonths(\DateTimeInterface $date, int $months): CarbonImmutable
    {
        return CarbonImmutable::instance($date)->addMonths($months);
    }

    private function isUniqueConstraintError(QueryException $exception): bool
    {
        $errorInfo = $exception->errorInfo;

        if (! is_array($errorInfo)) {
            return false;
        }

        return ($errorInfo[0] ?? null) === '23000' || ($errorInfo[1] ?? null) === 1062;
    }
}
