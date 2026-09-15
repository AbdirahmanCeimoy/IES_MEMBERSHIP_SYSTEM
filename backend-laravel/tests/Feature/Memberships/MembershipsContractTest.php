<?php

namespace Tests\Feature\Memberships;

use App\Enums\ApplicationDecision;
use App\Enums\ApplicationStage;
use App\Enums\MembershipGrade;
use App\Enums\UserRole;
use App\Models\MembershipApplication;
use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MembershipsContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_verify_returns_false_when_member_is_missing(): void
    {
        $this->getJson('/api/memberships/verify?registrationNumber=IES-SOM-UNKNOWN')
            ->assertOk()
            ->assertExactJson([
                'verified' => false,
                'member' => null,
            ]);
    }

    public function test_register_requires_bearer_token(): void
    {
        $this->getJson('/api/memberships/register')
            ->assertUnauthorized()
            ->assertExactJson([
                'statusCode' => 401,
                'message' => 'Missing Bearer token',
                'error' => 'Unauthorized',
            ]);
    }

    public function test_public_verify_returns_active_member_payload(): void
    {
        $user = User::query()->create([
            'id' => 'u-1',
            'username' => 'memberuser',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Member User',
            'email' => 'member@gmail.com',
            'role' => UserRole::MEMBER,
        ]);

        MembershipApplication::query()->create([
            'id' => 'app-1',
            'applicantId' => $user->id,
            'fullName' => 'Member User',
            'email' => 'member@gmail.com',
            'phone' => '252610000000',
            'nationalIdNumber' => '12345678901',
            'membershipGrade' => MembershipGrade::GRADUATE,
            'declarationAccepted' => true,
            'stage' => ApplicationStage::REGISTERED,
            'decision' => ApplicationDecision::APPROVED,
            'registrationNumber' => 'IES-SOM-2026-ABC123',
            'certificateNumber' => 'CERT-2026-ABCDEFGH',
            'validUntil' => now()->addMonth(),
        ]);

        $this->getJson('/api/memberships/verify?registrationNumber=ies-som-2026-abc123')
            ->assertOk()
            ->assertJsonPath('verified', true)
            ->assertJsonPath('member.registrationNumber', 'IES-SOM-2026-ABC123')
            ->assertJsonPath('member.status', 'ACTIVE');
    }
}
