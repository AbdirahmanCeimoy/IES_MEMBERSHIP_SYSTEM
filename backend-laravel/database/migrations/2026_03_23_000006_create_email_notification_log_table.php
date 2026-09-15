<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('EmailNotificationLog', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('applicationId');
            $table->string('type');
            $table->string('recipientEmail');
            $table->string('subject');
            $table->string('status')->default('PENDING');
            $table->integer('attempts')->default(0);
            $table->string('providerMessageId')->nullable();
            $table->text('errorMessage')->nullable();
            $table->timestamp('sentAt')->nullable();
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('applicationId', 'EmailNotificationLog_applicationId_fkey')
                ->references('id')
                ->on('MembershipApplication')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('EmailNotificationLog');
    }
};
