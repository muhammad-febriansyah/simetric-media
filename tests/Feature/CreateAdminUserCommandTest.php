<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('creates a verified admin with the typed password', function () {
    $this->artisan('app:create-admin-user', ['--name' => 'Yana', '--email' => 'yana@simetricdigital.com'])
        ->expectsQuestion('Password (minimal 8 karakter)', 'rahasia-kuat-123')
        ->expectsQuestion('Ulangi password', 'rahasia-kuat-123')
        ->assertSuccessful();

    $user = User::query()->where('email', 'yana@simetricdigital.com')->sole();

    expect($user->is_admin)->toBeTrue()
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(Hash::check('rahasia-kuat-123', $user->password))->toBeTrue();
});

test('refuses a password confirmation that does not match', function () {
    $this->artisan('app:create-admin-user', ['--name' => 'Yana', '--email' => 'yana@simetricdigital.com'])
        ->expectsQuestion('Password (minimal 8 karakter)', 'rahasia-kuat-123')
        ->expectsQuestion('Ulangi password', 'beda-123456')
        ->assertFailed();

    expect(User::query()->where('email', 'yana@simetricdigital.com')->exists())->toBeFalse();
});

test('promotes an existing account only after confirmation', function () {
    $user = User::factory()->create(['email' => 'staf@simetricdigital.com']);

    $this->artisan('app:create-admin-user', ['--name' => 'Staf', '--email' => 'staf@simetricdigital.com'])
        ->expectsQuestion('Password (minimal 8 karakter)', 'rahasia-kuat-123')
        ->expectsQuestion('Ulangi password', 'rahasia-kuat-123')
        ->expectsConfirmation('Akun staf@simetricdigital.com sudah ada. Jadikan admin dan ganti password-nya?', 'yes')
        ->assertSuccessful();

    expect($user->refresh()->is_admin)->toBeTrue();
});
