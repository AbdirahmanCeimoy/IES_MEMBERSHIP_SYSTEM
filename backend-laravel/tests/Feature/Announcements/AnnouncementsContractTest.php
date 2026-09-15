<?php

namespace Tests\Feature\Announcements;

use App\Enums\UserRole;
use App\Models\Announcement;
use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnouncementsContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_announcements_create_requires_bearer_token(): void
    {
        $this->postJson('/api/announcements', [])
            ->assertUnauthorized()
            ->assertExactJson([
                'statusCode' => 401,
                'message' => 'Missing Bearer token',
                'error' => 'Unauthorized',
            ]);
    }

    public function test_only_admin_can_create_announcement(): void
    {
        $member = User::query()->create([
            'id' => 'announcement-member',
            'username' => 'announcementmember',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Announcement Member',
            'email' => 'announcementmember@gmail.com',
            'role' => UserRole::MEMBER,
        ]);

        $token = $this->tokenFor($member);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/announcements', [
                'title' => 'Annual Meeting',
                'body' => 'Meeting is scheduled for next week.',
                'channel' => 'general',
            ])
            ->assertForbidden()
            ->assertExactJson([
                'statusCode' => 403,
                'message' => 'Insufficient role permissions',
                'error' => 'Forbidden',
            ]);
    }

    public function test_admin_can_create_announcement(): void
    {
        $admin = User::query()->create([
            'id' => 'announcement-admin',
            'username' => 'announcementadmin',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Announcement Admin',
            'email' => 'announcementadmin@gmail.com',
            'role' => UserRole::ADMIN,
        ]);

        $token = $this->tokenFor($admin);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/announcements', [
                'title' => 'Annual Meeting',
                'body' => 'Meeting is scheduled for next week.',
                'channel' => 'general',
            ])
            ->assertCreated()
            ->assertJsonPath('title', 'Annual Meeting')
            ->assertJsonPath('body', 'Meeting is scheduled for next week.')
            ->assertJsonPath('channel', 'general');
    }

    public function test_member_can_list_announcements_in_descending_created_order(): void
    {
        $member = User::query()->create([
            'id' => 'announcement-member-list',
            'username' => 'announcementmemberlist',
            'passwordHash' => bcrypt('Secure1234'),
            'fullName' => 'Announcement Member List',
            'email' => 'announcementmemberlist@gmail.com',
            'role' => UserRole::MEMBER,
        ]);

        Announcement::query()->create([
            'id' => 'announcement-older',
            'title' => 'Older Announcement',
            'body' => 'Older body',
            'channel' => 'general',
            'createdAt' => now()->subDay(),
        ]);

        Announcement::query()->create([
            'id' => 'announcement-newer',
            'title' => 'Newer Announcement',
            'body' => 'Newer body',
            'channel' => 'members',
            'createdAt' => now(),
        ]);

        $token = $this->tokenFor($member);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/announcements')
            ->assertOk()
            ->assertJsonPath('0.id', 'announcement-newer')
            ->assertJsonPath('1.id', 'announcement-older')
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'title',
                    'body',
                    'channel',
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
