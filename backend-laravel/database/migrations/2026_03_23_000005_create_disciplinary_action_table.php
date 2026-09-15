<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('DisciplinaryAction', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('applicationId');
            $table->string('type');
            $table->text('reason');
            $table->timestamp('startDate')->useCurrent();
            $table->timestamp('endDate')->nullable();
            $table->string('createdBy');
            $table->timestamp('createdAt')->useCurrent();

            $table->foreign('applicationId', 'DisciplinaryAction_applicationId_fkey')
                ->references('id')
                ->on('MembershipApplication')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('DisciplinaryAction');
    }
};
