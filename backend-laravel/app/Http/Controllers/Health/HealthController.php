<?php

namespace App\Http\Controllers\Health;

use App\Http\Controllers\Controller;
use App\Services\Health\HealthService;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function __construct(
        private readonly HealthService $healthService
    ) {
    }

    public function live(): JsonResponse
    {
        return response()->json($this->healthService->live(), 200);
    }

    public function ready(): JsonResponse
    {
        return response()->json($this->healthService->ready(), 200);
    }
}
