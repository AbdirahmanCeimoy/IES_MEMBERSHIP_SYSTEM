<?php

namespace App\Http\Controllers\Memberships;

use App\Exceptions\NestHttpException;
use App\Http\Controllers\Controller;
use App\Services\Memberships\MembershipsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MembershipsPublicController extends Controller
{
    public function __construct(
        private readonly MembershipsService $membershipsService
    ) {
    }

    public function verifyByRegistration(string $registrationNumber): JsonResponse
    {
        return response()->json(
            $this->membershipsService->verifyMembershipPublic([
                'registrationNumber' => $registrationNumber,
            ]),
            200
        );
    }

    public function verify(Request $request): JsonResponse
    {
        $registrationNumber = $request->query('registrationNumber');
        $certificateNumber = $request->query('certificateNumber');

        if (! $registrationNumber && ! $certificateNumber) {
            throw NestHttpException::badRequest('Provide registrationNumber or certificateNumber');
        }

        return response()->json(
            $this->membershipsService->verifyMembershipPublic([
                'registrationNumber' => is_string($registrationNumber) ? $registrationNumber : null,
                'certificateNumber' => is_string($certificateNumber) ? $certificateNumber : null,
            ]),
            200
        );
    }

    public function search(Request $request): JsonResponse
    {
        $searchTerm = $request->query('q', '');
        if (! is_string($searchTerm) || trim($searchTerm) === '') {
            throw NestHttpException::badRequest('Provide search term via ?q=');
        }

        return response()->json(
            $this->membershipsService->searchMembersPublic($searchTerm),
            200
        );
    }
}
