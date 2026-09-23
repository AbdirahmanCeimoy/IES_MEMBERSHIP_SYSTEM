<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add gender to both User and MembershipApplication so it can be
        // set at profile creation time and joined for analytics.
        Schema::table('user', function (Blueprint $table): void {
            if (! Schema::hasColumn('user', 'gender')) {
                $table->string('gender', 20)->nullable()->after('email');
            }
            if (! Schema::hasColumn('user', 'title')) {
                $table->string('title', 20)->nullable()->after('gender');
            }
            if (! Schema::hasColumn('user', 'firstName')) {
                $table->string('firstName', 100)->nullable()->after('title');
            }
            if (! Schema::hasColumn('user', 'lastName')) {
                $table->string('lastName', 100)->nullable()->after('firstName');
            }
            if (! Schema::hasColumn('user', 'dateOfBirth')) {
                $table->date('dateOfBirth')->nullable()->after('lastName');
            }
            if (! Schema::hasColumn('user', 'discipline')) {
                $table->string('discipline', 100)->nullable()->after('dateOfBirth');
            }
            if (! Schema::hasColumn('user', 'grade')) {
                $table->string('grade', 20)->nullable()->after('discipline');
            }
        });

        Schema::table('MembershipApplication', function (Blueprint $table): void {
            if (! Schema::hasColumn('MembershipApplication', 'gender')) {
                $table->string('gender', 20)->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('user', function (Blueprint $table): void {
            foreach (['gender', 'title', 'firstName', 'lastName', 'dateOfBirth', 'discipline', 'grade'] as $col) {
                if (Schema::hasColumn('user', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
        Schema::table('MembershipApplication', function (Blueprint $table): void {
            if (Schema::hasColumn('MembershipApplication', 'gender')) {
                $table->dropColumn('gender');
            }
        });
    }
};
