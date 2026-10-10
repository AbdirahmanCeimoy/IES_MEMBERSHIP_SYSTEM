<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('Event', function (Blueprint $table): void {
            if (! Schema::hasColumn('Event', 'time')) {
                $table->string('time', 32)->nullable()->after('date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('Event', function (Blueprint $table): void {
            if (Schema::hasColumn('Event', 'time')) {
                $table->dropColumn('time');
            }
        });
    }
};
