<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('OrganizationApplication', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('organizationName');
            $table->string('organizationType');
            $table->string('registrationNumber');
            $table->string('contactPerson');
            $table->string('contactEmail');
            $table->string('contactPhone');
            $table->boolean('legalStatusConfirmed');
            $table->timestamp('createdAt')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('OrganizationApplication');
    }
};
