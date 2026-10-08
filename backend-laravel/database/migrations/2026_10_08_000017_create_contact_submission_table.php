<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ContactSubmission', function (Blueprint $table): void {
            $table->string('id')->primary();
            // Submission kind: 'contact' (general inquiry) or 'report' (violation report)
            $table->string('type', 32)->default('contact');
            // Category chosen in the form (General Inquiry, Ethical Violation, etc.)
            $table->string('category', 64)->nullable();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 64)->nullable();
            $table->string('subject');
            $table->text('message');
            $table->string('regNumber', 64)->nullable();
            $table->boolean('isMember')->default(false);
            $table->boolean('anonymous')->default(false);
            // Review workflow: NEW -> IN_PROGRESS -> RESOLVED / DISMISSED
            $table->string('status', 32)->default('NEW');
            $table->text('adminNotes')->nullable();
            $table->string('ipAddress', 64)->nullable();
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent();

            $table->index('type');
            $table->index('status');
            $table->index('createdAt');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ContactSubmission');
    }
};
