<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Assistant\AssistantController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Announcements\AnnouncementsController;
use App\Http\Controllers\Contacts\ContactsController;
use App\Http\Controllers\Events\EventsController;
use App\Http\Controllers\Health\HealthController;
use App\Http\Controllers\Memberships\MembershipsController;
use App\Http\Controllers\Memberships\MembershipsPublicController;
use App\Http\Controllers\Newsletters\AdminNewslettersController;
use App\Http\Controllers\Newsletters\SubscriptionsController;
use App\Http\Controllers\Newsletters\WebhookController;
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
    Route::post('forgot-password/request', [AuthController::class, 'requestPasswordReset']);
    Route::post('forgot-password/verify-otp', [AuthController::class, 'verifyPasswordResetOtp']);
    Route::post('forgot-password/reset-with-token', [AuthController::class, 'resetPasswordWithToken']);
    Route::post('email/send-verification', [AuthController::class, 'sendEmailVerification']);
    Route::post('email/verify', [AuthController::class, 'verifyEmail']);
    Route::post('email/change-pending', [AuthController::class, 'changePendingEmail']);

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
    Route::get('search', [MembershipsPublicController::class, 'search']);
    Route::get('public-photo/{documentId}', [MembershipsPublicController::class, 'publicPhoto']);

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

// Public contact + report submissions
Route::post('contact', [ContactsController::class, 'store']);

// Admin — view / manage submissions
Route::prefix('admin/contacts')
    ->middleware(['jwt.auth', 'role:ADMIN'])
    ->group(function (): void {
        Route::get('', [ContactsController::class, 'list']);
        Route::get('{id}', [ContactsController::class, 'get']);
        Route::patch('{id}', [ContactsController::class, 'update']);
        Route::delete('{id}', [ContactsController::class, 'remove']);
    });

/*
 * Newsletter — public subscription + confirmation + unsubscribe + Resend webhook.
 * Admin endpoints are JWT-protected and scoped to the ADMIN role.
 */
Route::prefix('newsletters')->group(function (): void {
    Route::post('subscribe', [SubscriptionsController::class, 'subscribe']);
    Route::post('confirm/{token}', [SubscriptionsController::class, 'confirm']);
    Route::get('confirm/{token}', [SubscriptionsController::class, 'confirm']);
    Route::post('unsubscribe/{token}', [SubscriptionsController::class, 'unsubscribe']);
    Route::get('unsubscribe/{token}', [SubscriptionsController::class, 'unsubscribe']);
    Route::post('webhooks/resend', [WebhookController::class, 'resend']);
});

Route::prefix('admin/newsletters')
    ->middleware(['jwt.auth', 'role:ADMIN'])
    ->group(function (): void {
        Route::get('dashboard', [AdminNewslettersController::class, 'dashboard']);
        Route::get('eligible-count', [AdminNewslettersController::class, 'eligibleRecipientCount']);

        Route::get('subscribers', [AdminNewslettersController::class, 'listSubscribers']);
        Route::patch('subscribers/{id}/suppress', [AdminNewslettersController::class, 'suppressSubscriber']);

        Route::get('campaigns', [AdminNewslettersController::class, 'listCampaigns']);
        Route::post('campaigns', [AdminNewslettersController::class, 'createCampaign']);
        Route::get('campaigns/{id}', [AdminNewslettersController::class, 'getCampaign']);
        Route::patch('campaigns/{id}', [AdminNewslettersController::class, 'updateCampaign']);
        Route::delete('campaigns/{id}', [AdminNewslettersController::class, 'deleteCampaign']);
        Route::post('campaigns/{id}/test', [AdminNewslettersController::class, 'sendTest']);
        Route::post('campaigns/{id}/send', [AdminNewslettersController::class, 'send']);
        Route::get('campaigns/{id}/deliveries', [AdminNewslettersController::class, 'campaignDeliveries']);
        Route::post('campaigns/{id}/retry-failed', [AdminNewslettersController::class, 'retryFailed']);
    });

/*
 * IES AI Assistant — public floating widget endpoint.
 * Rate-limited per IP; grounded in config('ies_knowledge') + OpenAI.
 */
Route::prefix('assistant')->group(function (): void {
    Route::get('health', [AssistantController::class, 'health']);
    Route::post('chat', [AssistantController::class, 'chat']);
});
