<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
    $this->actingAs($this->admin);
});

test('lists users and marks the signed-in admin', function () {
    User::factory()->create();

    $this->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->has('users', 2)
            ->where('users.0.id', $this->admin->id)
            ->where('users.0.is_current', true)
        );
});

test('creates a verified admin account that can log in', function () {
    $this->post(route('admin.users.store'), [
        'name' => 'Rina Wijaya',
        'email' => 'rina@perusahaan.test',
        'password' => 'password-rahasia',
        'password_confirmation' => 'password-rahasia',
        'is_admin' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.users.index'));

    $user = User::query()->where('email', 'rina@perusahaan.test')->sole();

    expect($user->is_admin)->toBeTrue()
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(Hash::check('password-rahasia', $user->password))->toBeTrue();
});

test('requires a confirmed password when creating', function () {
    $this->post(route('admin.users.store'), [
        'name' => 'Rina',
        'email' => 'rina@perusahaan.test',
        'password' => 'password-rahasia',
        'password_confirmation' => 'berbeda',
    ])->assertSessionHasErrors(['password' => 'Konfirmasi Password tidak cocok.']);
});

test('keeps the password when the field is left empty on update', function () {
    $user = User::factory()->admin()->create();
    $originalHash = $user->password;

    $this->put(route('admin.users.update', $user), [
        'name' => 'Nama Baru',
        'email' => $user->email,
        'is_admin' => '1',
    ])->assertSessionHasNoErrors();

    expect($user->refresh()->name)->toBe('Nama Baru')
        ->and($user->password)->toBe($originalHash);
});

test('revokes admin access of another user', function () {
    $user = User::factory()->admin()->create();

    $this->put(route('admin.users.update', $user), [
        'name' => $user->name,
        'email' => $user->email,
    ])->assertSessionHasNoErrors();

    expect($user->refresh()->is_admin)->toBeFalse();
});

test('prevents admins from revoking their own admin access', function () {
    $this->put(route('admin.users.update', $this->admin), [
        'name' => $this->admin->name,
        'email' => $this->admin->email,
    ])->assertSessionHasErrors(['is_admin' => 'Anda tidak bisa mencabut akses admin akun Anda sendiri.']);

    expect($this->admin->refresh()->is_admin)->toBeTrue();
});

test('deletes another user but not the signed-in admin', function () {
    $user = User::factory()->create();

    $this->delete(route('admin.users.destroy', $user))->assertRedirect(route('admin.users.index'));
    $this->assertModelMissing($user);

    $this->delete(route('admin.users.destroy', $this->admin))->assertRedirect(route('admin.users.index'));
    $this->assertModelExists($this->admin);
});
