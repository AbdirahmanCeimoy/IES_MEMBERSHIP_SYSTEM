<?php

namespace Tests\Feature\Organizations;

use App\Enums\UserRole;
use App\Models\OrganizationApplication;
use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganizationsContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_organization_create_requires_bearer_token(): void
    {
        $this->postJson('/api/organizations/applications', [])
            ->assertUnauthorized()
            ->assertExactJson([
                'statusCode' => 401,
                'message' => 'Missing Bearer token',
                'error' => 'Unauthorized',
            ]);
    }

    public function test_member_can_submit_organization_application(): void
    {
        $member = User::query()->create([
            'id' => 'org-member',
            'username' => 'orgmember',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Org Member',
            'email' => 'orgmember@gmail.com',
            'role' => UserRole::MEMBER,
        ]);

        $token = $this->tokenFor($member);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/organizations/applications', [
                'organizationName' => 'IES Partners',
                'organizationType' => 'NGO',
                'registrationNumber' => 'REG-001',
                'contactPerson' => 'Jane Doe',
                'contactEmail' => 'jane@gmail.com',
                'contactPhone' => '252610000000',
                'legalStatusConfirmed' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('organizationName', 'IES Partners');
    }

    public function test_organization_create_requires_true_boolean_legal_status_confirmation(): void
    {
        $member = User::query()->create([
            'id' => 'org-member-bool',
            'username' => 'orgmemberbool',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Org Member Bool',
            'email' => 'orgmemberbool@gmail.com',
            'role' => UserRole::MEMBER,
        ]);

        $token = $this->tokenFor($member);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/organizations/applications', [
                'organizationName' => 'IES Partners',
                'organizationType' => 'NGO',
                'registrationNumber' => 'REG-001',
                'contactPerson' => 'Jane Doe',
                'contactEmail' => 'jane@gmail.com',
                'contactPhone' => '252610000000',
                'legalStatusConfirmed' => 'true',
            ])
            ->assertBadRequest()
            ->assertExactJson([
                'statusCode' => 400,
                'message' => ['legalStatusConfirmed must be a boolean value'],
                'error' => 'Bad Request',
            ]);
    }

    public function test_only_admin_can_list_organization_applications(): void
    {
        $reviewer = User::query()->create([
            'id' => 'org-reviewer',
            'username' => 'reviewer',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Org Reviewer',
            'email' => 'reviewer@gmail.com',
            'role' => UserRole::REVIEWER,
        ]);

        $token = $this->tokenFor($reviewer);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/organizations/applications')
            ->assertForbidden()
            ->assertExactJson([
                'statusCode' => 403,
                'message' => 'Insufficient role permissions',
                'error' => 'Forbidden',
            ]);
    }

    public function test_admin_can_list_organization_applications_in_descending_created_order(): void
    {
        $admin = User::query()->create([
            'id' => 'org-admin',
            'username' => 'orgadmin',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Org Admin',
            'email' => 'orgadmin@gmail.com',
            'role' => UserRole::ADMIN,
        ]);

        OrganizationApplication::query()->create([
            'id' => 'org-app-older',
            'organizationName' => 'Older Org',
            'organizationType' => 'Company',
            'registrationNumber' => 'REG-OLD',
            'contactPerson' => 'Older Person',
            'contactEmail' => 'older@gmail.com',
            'contactPhone' => '252611111111',
            'legalStatusConfirmed' => true,
            'createdAt' => now()->subDay(),
        ]);

        OrganizationApplication::query()->create([
            'id' => 'org-app-newer',
            'organizationName' => 'Newer Org',
            'organizationType' => 'NGO',
            'registrationNumber' => 'REG-NEW',
            'contactPerson' => 'Newer Person',
            'contactEmail' => 'newer@gmail.com',
            'contactPhone' => '252622222222',
            'legalStatusConfirmed' => true,
            'createdAt' => now(),
        ]);

        $token = $this->tokenFor($admin);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/organizations/applications')
            ->assertOk()
            ->assertJsonPath('0.id', 'org-app-newer')
            ->assertJsonPath('1.id', 'org-app-older')
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'organizationName',
                    'organizationType',
                    'registrationNumber',
                    'contactPerson',
                    'contactEmail',
                    'contactPhone',
                    'legalStatusConfirmed',
                    'createdAt',
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
