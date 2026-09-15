<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_signup_returns_created_with_token_and_safe_user_payload(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'username' => 'signupuser',
            'password' => 'Secure1234',
            'fullName' => 'Signup User',
            'email' => 'signup@gmail.com',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'username', 'fullName', 'email', 'role'],
            ]);
    }

    public function test_me_requires_bearer_token(): void
    {
        $this->getJson('/api/auth/me')
            ->assertUnauthorized()
            ->assertExactJson([
                'statusCode' => 401,
                'message' => 'Missing Bearer token',
                'error' => 'Unauthorized',
            ]);
    }

    public function test_me_returns_current_user_profile(): void
    {
        $user = User::query()->create([
            'id' => 'u-1',
            'username' => 'memberuser',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Member User',
            'email' => 'member@gmail.com',
            'role' => UserRole::MEMBER,
        ]);

        $token = JWT::encode([
            'sub' => $user->id,
            'username' => $user->username,
            'role' => $user->role->value,
            'iat' => time(),
            'exp' => time() + 3600,
        ], env('JWT_SECRET', 'integration-test-secret-key-should-be-long'), 'HS256');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.id', 'u-1');
    }
}
