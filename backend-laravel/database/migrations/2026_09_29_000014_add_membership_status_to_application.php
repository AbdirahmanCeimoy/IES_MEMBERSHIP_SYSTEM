<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('MembershipApplication', function (Blueprint $table): void {
            if (! Schema::hasColumn('MembershipApplication', 'membershipStatus')) {
                $table->string('membershipStatus', 30)->nullable()->after('decision');
            }
        });
    }

    public function down(): void
    {
        Schema::table('MembershipApplication', function (Blueprint $table): void {
            $table->dropColumn('membershipStatus');
        });
    }
};
