<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Newsletter', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('subject');
            $table->string('previewText', 255)->nullable();
            $table->longText('contentHtml');
            $table->longText('contentText')->nullable();
            // draft | queued | sending | sent | partially_failed | failed
            $table->string('status', 32)->default('draft');
            $table->string('createdBy')->nullable();
            $table->unsignedInteger('recipientCount')->default(0);
            $table->unsignedInteger('acceptedCount')->default(0);
            $table->unsignedInteger('deliveredCount')->default(0);
            $table->unsignedInteger('bouncedCount')->default(0);
            $table->unsignedInteger('failedCount')->default(0);
            $table->timestamp('startedAt')->nullable();
            $table->timestamp('completedAt')->nullable();
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent();

            $table->index('status');
            $table->index('createdAt');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Newsletter');
    }
};
