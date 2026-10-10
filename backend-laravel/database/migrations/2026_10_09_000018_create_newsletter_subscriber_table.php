<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('NewsletterSubscriber', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('email')->unique();
            // pending | subscribed | unsubscribed | suppressed
            $table->string('status', 24)->default('pending');
            $table->string('confirmToken', 128)->nullable();
            $table->timestamp('confirmTokenExpiresAt')->nullable();
            $table->timestamp('emailVerifiedAt')->nullable();
            $table->string('unsubscribeToken', 128)->unique();
            $table->timestamp('unsubscribedAt')->nullable();
            $table->string('ipAddress', 64)->nullable();
            $table->string('userAgent', 512)->nullable();
            $table->string('source', 64)->nullable();
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent();

            $table->index('status');
            $table->index('createdAt');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('NewsletterSubscriber');
    }
};
