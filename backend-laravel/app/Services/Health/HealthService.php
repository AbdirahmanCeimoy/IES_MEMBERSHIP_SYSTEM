<?php

namespace App\Services\Health;

use App\Exceptions\NestHttpException;
use App\Services\Memberships\MembershipNotificationService;
use App\Support\Iso8601;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthService
{
    public function __construct(
        private readonly MembershipNotificationService $membershipNotificationService
    ) {
    }

    public function live(): array
    {
        return [
            'status' => 'ok',
            'timestamp' => Iso8601::format(now()),
        ];
    }

    public function ready(): array
    {
        try {
            DB::select('SELECT 1');
            $this->membershipNotificationService->verifyDeliveryReady();

            return [
                'status' => 'ok',
                'checks' => [
                    'database' => 'ok',
                    'email' => 'ok',
                ],
                'timestamp' => Iso8601::format(now()),
            ];
        } catch (Throwable) {
            throw NestHttpException::serviceUnavailable('Database or email delivery is not ready');
        }
    }
}
