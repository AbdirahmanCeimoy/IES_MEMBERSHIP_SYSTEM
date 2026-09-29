<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            if (! Schema::hasColumn('User', 'phone')) {
                $table->string('phone', 30)->nullable()->after('discipline');
            }
            if (! Schema::hasColumn('User', 'nationalId')) {
                $table->string('nationalId', 30)->nullable()->after('phone');
            }
            if (! Schema::hasColumn('User', 'city')) {
                $table->string('city', 100)->nullable()->after('nationalId');
            }
            if (! Schema::hasColumn('User', 'nationality')) {
                $table->string('nationality', 100)->nullable()->after('city');
            }
        });
    }

    public function down(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            $table->dropColumn(['phone', 'nationalId', 'city', 'nationality']);
        });
    }
};
