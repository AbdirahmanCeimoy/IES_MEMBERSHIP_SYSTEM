<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Announcements\AnnouncementsController;
use App\Http\Controllers\Events\EventsController;
use App\Http\Controllers\Health\HealthController;
use App\Http\Controllers\Memberships\MembershipsController;
use App\Http\Controllers\Memberships\MembershipsPublicController;
use App\Http\Controllers\Organizations\OrganizationsController;
use App\Http\Controllers\Users\UsersController;
use Illuminate\Support\Facades\Route;

Route::prefix('health')->group(function (): void {
    Route::get('live', [HealthController::class, 'live']);
    Route::get('ready', [HealthController::class, 'ready']);
});

Route::prefix('auth')->group(function (): void {
    Route::post('signup', [AuthController::class, 'signup']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password/reset', [AuthController::class, 'resetPasswordWithValidation']);

    Route::middleware('jwt.auth')->group(function (): void {
        Route::get('me', [AuthController::class, 'me']);
        Route::patch('me', [AuthController::class, 'updateMe']);
        Route::patch('me/password', [AuthController::class, 'updateMyPassword']);
        Route::patch('me/finalize-credentials', [AuthController::class, 'finalizeCredentials']);
    });
});

Route::prefix('memberships')->group(function (): void {
    Route::get('verify/{registrationNumber}', [MembershipsPublicController::class, 'verifyByRegistration']);
    Route::get('verify', [MembershipsPublicController::class, 'verify']);

    Route::middleware('jwt.auth')->group(function (): void {
        Route::post('applications', [MembershipsController::class, 'create'])->middleware('role:MEMBER,ADMIN');
        Route::get('applications', [MembershipsController::class, 'list'])->middleware('role:ADMIN');
        Route::get('applications/{id}', [MembershipsController::class, 'get'])->middleware('role:ADMIN');
        Route::get('my-applications', [MembershipsController::class, 'listOwn'])->middleware('role:MEMBER,ADMIN');
        Route::get('my-applications/{id}', [MembershipsController::class, 'getOwn'])->middleware('role:MEMBER,ADMIN');
        Route::get('applications/{id}/documents/{documentId}/download', [MembershipsController::class, 'downloadDocument'])->middleware('role:MEMBER,ADMIN');
        Route::delete('applications/{id}/documents/{documentId}', [MembershipsController::class, 'removeDocument'])->middleware('role:ADMIN');
        Route::patch('applications/{id}/stage', [MembershipsController::class, 'setStage'])->middleware('role:ADMIN');
        Route::patch('applications/{id}/decision', [MembershipsController::class, 'decision'])->middleware('role:ADMIN');
        Route::post('applications/{id}/renew', [MembershipsController::class, 'renew'])->middleware('role:ADMIN');
        Route::patch('applications/{id}/upgrade', [MembershipsController::class, 'upgrade'])->middleware('role:ADMIN');
        Route::post('applications/{id}/disciplinary', [MembershipsController::class, 'disciplinary'])->middleware('role:ADMIN');
        Route::get('register', [MembershipsController::class, 'register'])->middleware('role:ADMIN');
        Route::get('certificate/{id}', [MembershipsController::class, 'certificate'])->middleware('role:MEMBER,ADMIN');
        Route::delete('applications/{id}', [MembershipsController::class, 'remove'])->middleware('role:ADMIN');
    });
});

Route::prefix('users')
    ->middleware(['jwt.auth', 'role:ADMIN'])
    ->group(function (): void {
        Route::get('', [UsersController::class, 'list']);
        Route::get('{id}', [UsersController::class, 'get']);
        Route::delete('bulk/non-admin', [UsersController::class, 'removeAllNonAdmin']);
        Route::patch('{id}', [UsersController::class, 'update']);
        Route::patch('{id}/role', [UsersController::class, 'updateRole']);
        Route::delete('{id}', [UsersController::class, 'remove']);
        Route::post('{id}/register', [UsersController::class, 'createManualRegister']);
    });

Route::prefix('organizations')
    ->middleware('jwt.auth')
    ->group(function (): void {
        Route::post('applications', [OrganizationsController::class, 'create'])->middleware('role:MEMBER,REVIEWER,ADMIN');
        Route::get('applications', [OrganizationsController::class, 'list'])->middleware('role:ADMIN');
    });

Route::prefix('announcements')
    ->middleware('jwt.auth')
    ->group(function (): void {
        Route::post('', [AnnouncementsController::class, 'create'])->middleware('role:ADMIN');
        Route::get('', [AnnouncementsController::class, 'list'])->middleware('role:MEMBER,REVIEWER,ADMIN');
    });

/**
 * Admin panel endpoints — every route here requires the caller to hold
 * the ADMIN role. Actions performed here are logged for audit.
 */
Route::prefix('admin')
    ->middleware(['jwt.auth', 'role:ADMIN'])
    ->group(function (): void {
        Route::get('stats', [AdminController::class, 'stats']);
        Route::get('analytics', [AdminController::class, 'analytics']);
        Route::get('applications', [AdminController::class, 'applications']);
        Route::get('reports/{key}', [AdminController::class, 'report']);
        Route::get('events', [EventsController::class, 'listAdmin']);
        Route::post('events', [EventsController::class, 'create']);
    });

// Public events
Route::get('events', [EventsController::class, 'listPublic']);
Route::post('events/{id}/register', [EventsController::class, 'register'])
    ->middleware(['jwt.auth', 'role:MEMBER,ADMIN']);
