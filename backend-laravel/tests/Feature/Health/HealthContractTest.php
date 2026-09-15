<?php

namespace Tests\Feature\Health;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthContractTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->configureSmtpEnv();
    }

    public function test_health_live_returns_ok_shape(): void
    {
        $this->getJson('/api/health/live')
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonStructure(['status', 'timestamp']);
    }

    public function test_health_ready_returns_ok_when_database_and_email_are_ready(): void
    {
        $this->getJson('/api/health/ready')
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('checks.database', 'ok')
            ->assertJsonPath('checks.email', 'ok')
            ->assertJsonStructure(['status', 'checks', 'timestamp']);
    }

    public function test_health_ready_returns_service_unavailable_when_email_config_is_missing(): void
    {
        $this->clearSmtpEnv();

        $this->getJson('/api/health/ready')
            ->assertStatus(503)
            ->assertExactJson([
                'statusCode' => 503,
                'message' => 'Database or email delivery is not ready',
                'error' => 'Service Unavailable',
            ]);
    }

    private function configureSmtpEnv(): void
    {
        putenv('SMTP_HOST=smtp.test.local');
        putenv('SMTP_PORT=465');
        putenv('SMTP_USER=tester@gmail.com');
        putenv('SMTP_PASS=test-app-password');
        putenv('SMTP_FROM=IES Membership <tester@gmail.com>');
    }

    private function clearSmtpEnv(): void
    {
        putenv('SMTP_HOST=');
        putenv('SMTP_PORT=');
        putenv('SMTP_USER=');
        putenv('SMTP_PASS=');
        putenv('SMTP_FROM=');
    }
}
