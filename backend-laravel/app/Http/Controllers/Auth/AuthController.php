<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\FinalizeCredentialsRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordWithValidationRequest;
use App\Http\Requests\Auth\SignupRequest;
use App\Http\Requests\Auth\UpdateMeRequest;
use App\Http\Requests\Auth\UpdateMyPasswordRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {
    }

    public function signup(SignupRequest $request): JsonResponse
    {
        return response()->json($this->authService->signup($request->validated()), 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        return response()->json($this->authService->login($request->validated()), 201);
    }

    public function resetPasswordWithValidation(ResetPasswordWithValidationRequest $request): JsonResponse
    {
        return response()->json(
            $this->authService->resetPasswordWithValidation($request->validated()),
            201
        );
    }

    public function me(Request $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->authService->me($auth['sub']), 200);
    }

    public function updateMe(UpdateMeRequest $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->authService->updateMe($auth['sub'], $request->validated()), 200);
    }

    public function updateMyPassword(UpdateMyPasswordRequest $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json(
            $this->authService->updateMyPassword($auth['sub'], $request->validated()),
            200
        );
    }

    public function finalizeCredentials(FinalizeCredentialsRequest $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json(
            $this->authService->finalizeCredentials($auth['sub'], $request->validated()),
            200
        );
    }
}
