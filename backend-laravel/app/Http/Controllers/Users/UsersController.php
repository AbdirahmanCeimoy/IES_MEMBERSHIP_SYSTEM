<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\CreateManualRegisterRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Requests\Users\UpdateUserRoleRequest;
use App\Services\Users\UsersService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function __construct(
        private readonly UsersService $usersService
    ) {
    }

    public function list(): JsonResponse
    {
        return response()->json($this->usersService->listUsers(), 200);
    }

    public function get(string $id): JsonResponse
    {
        return response()->json($this->usersService->getUser($id), 200);
    }

    public function removeAllNonAdmin(): JsonResponse
    {
        return response()->json($this->usersService->deleteAllNonAdminUsers(), 200);
    }

    public function update(string $id, UpdateUserRequest $request): JsonResponse
    {
        return response()->json($this->usersService->updateUser($id, $request->validated()), 200);
    }

    public function updateRole(string $id, UpdateUserRoleRequest $request): JsonResponse
    {
        return response()->json($this->usersService->updateRole($id, $request->validated()['role']), 200);
    }

    public function remove(string $id): JsonResponse
    {
        return response()->json($this->usersService->deleteUser($id), 200);
    }

    public function createManualRegister(string $id, CreateManualRegisterRequest $request, Request $httpRequest): JsonResponse
    {
        $auth = $httpRequest->attributes->get('auth');

        return response()->json(
            $this->usersService->createManualRegister($id, $request->validated(), $auth['sub']),
            201
        );
    }
}
