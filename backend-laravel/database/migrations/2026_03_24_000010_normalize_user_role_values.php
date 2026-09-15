<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            UPDATE `User`
            SET `role` = UPPER(`role`)
            WHERE LOWER(`role`) IN ('member', 'reviewer', 'admin')
        ");
    }

    public function down(): void
    {
        DB::statement("
            UPDATE `User`
            SET `role` = LOWER(`role`)
            WHERE `role` IN ('MEMBER', 'REVIEWER', 'ADMIN')
        ");
    }
};
