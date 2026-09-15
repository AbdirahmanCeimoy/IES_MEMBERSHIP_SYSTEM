<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('MembershipDocument', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('applicationId');
            $table->string('type');
            $table->string('fileName');
            $table->timestamp('createdAt')->useCurrent();

            $table->foreign('applicationId', 'MembershipDocument_applicationId_fkey')
                ->references('id')
                ->on('MembershipApplication')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('MembershipDocument');
    }
};
