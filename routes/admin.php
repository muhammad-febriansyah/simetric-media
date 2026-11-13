<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CaseStudyController;
use App\Http\Controllers\Admin\ClientLogoController;
use App\Http\Controllers\Admin\CompanyMilestoneController;
use App\Http\Controllers\Admin\ConsultationRequestController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\IndustryController;
use App\Http\Controllers\Admin\LeadNoteController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\OfficeController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\SolutionController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\TrashController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:access-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('leads', ConsultationRequestController::class)
            ->only(['index', 'show', 'update', 'destroy'])
            ->parameters(['leads' => 'consultationRequest']);
        Route::post('leads/{consultationRequest}/notes', [LeadNoteController::class, 'store'])->name('leads.notes.store');

        Route::post('notifications/read-all', [NotificationController::class, 'readAll'])->name('notifications.read-all');
        Route::post('notifications/{notification}/read', [NotificationController::class, 'read'])->name('notifications.read');

        Route::resource('case-studies', CaseStudyController::class)->except('show');
        Route::resource('services', ServiceController::class)->except('show');
        Route::resource('industries', IndustryController::class)->except('show');
        Route::resource('articles', ArticleController::class)->except('show');
        Route::resource('client-logos', ClientLogoController::class)->except('show');
        Route::resource('milestones', CompanyMilestoneController::class)->except('show')
            ->parameters(['milestones' => 'companyMilestone']);
        Route::resource('offices', OfficeController::class)->except('show');
        Route::resource('solutions', SolutionController::class)->except('show');
        Route::resource('faqs', FaqController::class)->except('show');
        Route::resource('team-members', TeamMemberController::class)->except('show');
        Route::resource('testimonials', TestimonialController::class)->except('show');
        Route::resource('users', UserController::class)->except('show');

        Route::get('settings/website', [SiteSettingController::class, 'edit'])->name('site-settings.edit');
        Route::put('settings/website', [SiteSettingController::class, 'update'])->name('site-settings.update');

        Route::get('trash', [TrashController::class, 'index'])->name('trash.index');
        Route::post('trash/{type}/{id}/restore', [TrashController::class, 'restore'])->name('trash.restore')->whereNumber('id');
        Route::delete('trash/{type}/{id}', [TrashController::class, 'destroy'])->name('trash.destroy')->whereNumber('id');
    });
