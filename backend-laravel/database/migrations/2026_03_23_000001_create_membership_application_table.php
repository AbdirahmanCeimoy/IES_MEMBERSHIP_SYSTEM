<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('MembershipApplication', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('applicantId');
            $table->string('fullName');
            $table->string('email');
            $table->string('phone');
            $table->string('nationalIdNumber');
            $table->string('membershipGrade');
            $table->string('organizationName')->nullable();
            $table->integer('yearsOfExperience')->nullable();
            $table->boolean('declarationAccepted');
            $table->text('bio')->nullable();
            $table->string('stage')->default('SUBMITTED');
            $table->string('decision')->default('PENDING');
            $table->text('rejectionReason')->nullable();
            $table->string('registrationNumber')->nullable();
            $table->string('certificateNumber')->nullable();
            $table->timestamp('validUntil')->nullable();
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();

            $table->unique('registrationNumber', 'MembershipApplication_registrationNumber_key');
            $table->unique('certificateNumber', 'MembershipApplication_certificateNumber_key');
            $table->foreign('applicantId', 'MembershipApplication_applicantId_fkey')
                ->references('id')
                ->on('User')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('MembershipApplication');
    }
};
