<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            if (! Schema::hasColumn('User', 'alternativePhone')) {
                $table->string('alternativePhone', 30)->nullable()->after('phone');
            }
            if (! Schema::hasColumn('User', 'address')) {
                $table->string('address', 255)->nullable()->after('city');
            }
            if (! Schema::hasColumn('User', 'district')) {
                $table->string('district', 100)->nullable()->after('address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            $table->dropColumn(['alternativePhone', 'address', 'district']);
        });
    }
};
