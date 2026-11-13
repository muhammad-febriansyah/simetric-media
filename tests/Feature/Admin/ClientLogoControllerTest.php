<?php

use App\Models\ClientLogo;
use App\Models\Industry;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
    Storage::fake('public');
});

test('creates a client logo linked to an industry', function () {
    $industry = Industry::factory()->create();

    $this->post(route('admin.client-logos.store'), [
        'name' => 'PT Maju Jaya',
        'industry_id' => $industry->id,
        'logo' => UploadedFile::fake()->image('logo.png'),
        'is_active' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.client-logos.index'));

    $clientLogo = ClientLogo::query()->sole();

    expect($clientLogo->industry_id)->toBe($industry->id)
        ->and($clientLogo->is_active)->toBeTrue();
    Storage::disk('public')->assertExists($clientLogo->logo);
});

test('requires a logo file when creating', function () {
    $this->post(route('admin.client-logos.store'), ['name' => 'PT Maju Jaya'])
        ->assertSessionHasErrors(['logo' => 'Logo wajib diisi.']);
});

test('keeps the current logo when no new file is uploaded', function () {
    $clientLogo = ClientLogo::factory()->create();

    $this->put(route('admin.client-logos.update', $clientLogo), ['name' => 'Nama Baru'])
        ->assertSessionHasNoErrors();

    expect($clientLogo->refresh()->name)->toBe('Nama Baru')
        ->and($clientLogo->is_active)->toBeFalse();
});

test('replaces the logo file and deletes the old one', function () {
    $oldLogo = UploadedFile::fake()->image('old.png')->store('client-logos', 'public');
    $clientLogo = ClientLogo::factory()->create(['logo' => $oldLogo]);

    $this->put(route('admin.client-logos.update', $clientLogo), [
        'name' => $clientLogo->name,
        'logo' => UploadedFile::fake()->image('new.png'),
    ])->assertSessionHasNoErrors();

    Storage::disk('public')->assertMissing($oldLogo);
    Storage::disk('public')->assertExists($clientLogo->refresh()->logo);
});

test('deletes the logo and its file', function () {
    $logo = UploadedFile::fake()->image('logo.png')->store('client-logos', 'public');
    $clientLogo = ClientLogo::factory()->create(['logo' => $logo]);

    $this->delete(route('admin.client-logos.destroy', $clientLogo))
        ->assertRedirect(route('admin.client-logos.index'));

    $this->assertModelMissing($clientLogo);
    Storage::disk('public')->assertMissing($logo);
});
