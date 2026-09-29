<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            if (! Schema::hasColumn('User', 'specialization')) {
                $table->string('specialization', 150)->nullable()->after('discipline');
            }
        });
    }

    public function down(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            $table->dropColumn('specialization');
        });
    }
};
