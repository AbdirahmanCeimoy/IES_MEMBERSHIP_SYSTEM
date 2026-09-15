<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('User', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('username')->unique('User_username_key');
            $table->string('passwordHash');
            $table->string('fullName');
            $table->string('email')->unique('User_email_key');
            $table->string('role')->default('MEMBER');
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('User');
    }
};
