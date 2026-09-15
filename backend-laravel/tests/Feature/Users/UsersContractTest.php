<?php

namespace Tests\Feature\Users;

use App\Enums\UserRole;
use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UsersContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_index_requires_bearer_token(): void
    {
        $this->getJson('/api/users')
            ->assertUnauthorized()
            ->assertExactJson([
                'statusCode' => 401,
                'message' => 'Missing Bearer token',
                'error' => 'Unauthorized',
            ]);
    }

    public function test_users_index_requires_admin_role(): void
    {
        $member = User::query()->create([
            'id' => 'u-member',
            'username' => 'memberuser',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Member User',
            'email' => 'member@gmail.com',
            'role' => UserRole::MEMBER,
        ]);

        $token = $this->tokenFor($member);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users')
            ->assertForbidden()
            ->assertExactJson([
                'statusCode' => 403,
                'message' => 'Insufficient role permissions',
                'error' => 'Forbidden',
            ]);
    }

    public function test_users_index_returns_admin_user_list_shape(): void
    {
        $admin = User::query()->create([
            'id' => 'u-admin',
            'username' => 'adminuser',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => UserRole::ADMIN,
        ]);

        $token = $this->tokenFor($admin);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users')
            ->assertOk()
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'username',
                    'fullName',
                    'email',
                    'role',
                    'createdAt',
                    'updatedAt',
                    'applicationsCount',
                    'documentsCount',
                    'registerCount',
                    'latestActivityAt',
                ],
            ]);
    }

    private function tokenFor(User $user): string
    {
        return JWT::encode([
            'sub' => $user->id,
            'username' => $user->username,
            'role' => $user->role->value,
            'iat' => time(),
            'exp' => time() + 3600,
        ], env('JWT_SECRET', 'integration-test-secret-key-should-be-long'), 'HS256');
    }
}
