<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Site\CaseStudyController;
use App\Http\Controllers\Site\ConsultationController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\HowWeWorkController;
use App\Http\Controllers\Site\IndustryController;
use App\Http\Controllers\Site\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('cara-kerja', HowWeWorkController::class)->name('how-we-work');

Route::get('layanan', [ServiceController::class, 'index'])->name('services.index');
Route::get('layanan/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::get('industri', [IndustryController::class, 'index'])->name('industries.index');
Route::get('industri/{industry:slug}', [IndustryController::class, 'show'])->name('industries.show');

Route::get('studi-kasus', [CaseStudyController::class, 'index'])->name('case-studies.index');
Route::get('studi-kasus/{caseStudy:slug}', [CaseStudyController::class, 'show'])->name('case-studies.show');

Route::get('konsultasi', [ConsultationController::class, 'create'])->name('consultation.create');
Route::post('konsultasi', [ConsultationController::class, 'store'])
    ->middleware('throttle:consultation')
    ->name('consultation.store');
Route::get('konsultasi/terima-kasih', [ConsultationController::class, 'thanks'])->name('consultation.thanks');

Route::middleware(['auth', 'verified', 'can:access-admin'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
