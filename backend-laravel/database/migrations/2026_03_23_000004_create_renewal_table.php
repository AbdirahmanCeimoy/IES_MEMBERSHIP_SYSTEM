<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Renewal', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('applicationId');
            $table->timestamp('requestedAt')->useCurrent();
            $table->integer('cpdCredits');
            $table->boolean('feePaid');
            $table->string('status')->default('PENDING');
            $table->text('decisionNotes')->nullable();
            $table->timestamp('approvedUntil')->nullable();

            $table->foreign('applicationId', 'Renewal_applicationId_fkey')
                ->references('id')
                ->on('MembershipApplication')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Renewal');
    }
};
