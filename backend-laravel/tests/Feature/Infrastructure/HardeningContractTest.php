<?php

namespace Tests\Feature\Infrastructure;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class HardeningContractTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
        putenv('RATE_LIMIT_WINDOW_MS=60000');
        putenv('RATE_LIMIT_MAX_REQUESTS=120');
    }

    public function test_auth_requests_are_rate_limited_with_retry_after_header(): void
    {
        putenv('RATE_LIMIT_MAX_REQUESTS=20');
        Cache::flush();

        for ($attempt = 1; $attempt <= 10; $attempt++) {
            $this->postJson('/api/auth/login', [])
                ->assertStatus(400);
        }

        $this->postJson('/api/auth/login', [])
            ->assertStatus(429)
            ->assertHeader('Retry-After')
            ->assertExactJson([
                'statusCode' => 429,
                'message' => 'Too many requests. Please try again shortly.',
            ]);
    }

    public function test_health_routes_are_exempt_from_rate_limiting(): void
    {
        putenv('RATE_LIMIT_MAX_REQUESTS=1');
        Cache::flush();

        $this->getJson('/api/health/live')
            ->assertOk()
            ->assertJsonPath('status', 'ok');

        $this->getJson('/api/health/live')
            ->assertOk()
            ->assertJsonPath('status', 'ok');
    }

    public function test_auth_traffic_is_logged(): void
    {
        Cache::flush();
        Log::spy();

        $this->postJson('/api/auth/login', [])
            ->assertStatus(400);

        Log::shouldHaveReceived('warning')
            ->withArgs(function ($message): bool {
                return is_string($message)
                    && str_contains($message, 'POST /api/auth/login')
                    && str_contains($message, ' 400 ')
                    && str_contains($message, 'ip=');
            })
            ->once();
    }
}
