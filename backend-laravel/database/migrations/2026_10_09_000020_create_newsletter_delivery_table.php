<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('NewsletterDelivery', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('newsletterId');
            $table->string('subscriberId')->nullable();
            $table->string('email');
            // queued | sent | delivered | bounced | failed | unsubscribed_before_send
            $table->string('status', 32)->default('queued');
            $table->string('providerMessageId', 128)->nullable();
            $table->timestamp('sentAt')->nullable();
            $table->timestamp('deliveredAt')->nullable();
            $table->timestamp('bouncedAt')->nullable();
            $table->string('failureReason', 1024)->nullable();
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent();

            $table->unique(['newsletterId', 'email'], 'nd_newsletter_email_unique');
            $table->index('status');
            $table->index('newsletterId');
            $table->index('providerMessageId');

            $table->foreign('newsletterId')->references('id')->on('Newsletter')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('NewsletterDelivery');
    }
};
