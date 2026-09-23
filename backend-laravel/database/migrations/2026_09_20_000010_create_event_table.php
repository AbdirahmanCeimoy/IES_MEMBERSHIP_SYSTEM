<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Event', function (Blueprint $table): void {
            $table->string('id', 36)->primary();
            $table->string('title');
            $table->string('type', 32)->default('WORKSHOP');
            $table->date('date');
            $table->string('location')->nullable();
            $table->decimal('cpdHours', 5, 2)->default(0);
            $table->text('description')->nullable();
            $table->string('status', 16)->default('PUBLISHED');
            $table->string('createdBy', 36)->nullable();
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();

            $table->index('status');
            $table->index('date');
        });

        Schema::create('EventRegistration', function (Blueprint $table): void {
            $table->string('id', 36)->primary();
            $table->string('eventId', 36);
            $table->string('userId', 36);
            $table->timestamp('registeredAt')->useCurrent();

            $table->unique(['eventId', 'userId']);
            $table->foreign('eventId')->references('id')->on('Event')->onDelete('cascade');
            $table->foreign('userId')->references('id')->on('user')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('EventRegistration');
        Schema::dropIfExists('Event');
    }
};
