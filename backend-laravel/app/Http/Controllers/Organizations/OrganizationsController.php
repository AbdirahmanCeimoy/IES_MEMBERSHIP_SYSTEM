<?php

namespace App\Http\Controllers\Organizations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organizations\CreateOrganizationRequest;
use App\Services\Organizations\OrganizationsService;
use Illuminate\Http\JsonResponse;

class OrganizationsController extends Controller
{
    public function __construct(
        private readonly OrganizationsService $organizationsService
    ) {
    }

    public function create(CreateOrganizationRequest $request): JsonResponse
    {
        return response()->json($this->organizationsService->create($request->validated()), 201);
    }

    public function list(): JsonResponse
    {
        return response()->json($this->organizationsService->list(), 200);
    }
}
