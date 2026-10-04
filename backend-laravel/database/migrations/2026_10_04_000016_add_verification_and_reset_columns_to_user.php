<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            if (! Schema::hasColumn('User', 'emailVerificationToken')) {
                $table->string('emailVerificationToken', 64)->nullable();
            }
            if (! Schema::hasColumn('User', 'emailVerificationExpiresAt')) {
                $table->timestamp('emailVerificationExpiresAt')->nullable();
            }
            if (! Schema::hasColumn('User', 'emailVerifiedAt')) {
                $table->timestamp('emailVerifiedAt')->nullable();
            }
            if (! Schema::hasColumn('User', 'passwordResetToken')) {
                $table->string('passwordResetToken', 64)->nullable();
            }
            if (! Schema::hasColumn('User', 'passwordResetExpiresAt')) {
                $table->timestamp('passwordResetExpiresAt')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            $table->dropColumn([
                'emailVerificationToken',
                'emailVerificationExpiresAt',
                'emailVerifiedAt',
                'passwordResetToken',
                'passwordResetExpiresAt',
            ]);
        });
    }
};
