<?php

use App\Enums\OfficeType;
use App\Models\Office;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
});

test('creates a head office', function () {
    $this->post(route('admin.offices.store'), [
        'name' => 'Kantor Pusat',
        'type' => 'head',
        'address' => 'Jl. Sudirman No. 1',
        'city' => 'Jakarta',
        'phone' => '021-1234567',
        'is_active' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.offices.index'));

    $office = Office::query()->sole();

    expect($office->type)->toBe(OfficeType::Head)
        ->and($office->is_active)->toBeTrue();
});

test('requires the name, type, address and city', function () {
    $this->post(route('admin.offices.store'), [])
        ->assertSessionHasErrors([
            'name' => 'Nama kantor wajib diisi.',
            'type' => 'Tipe kantor wajib diisi.',
            'address' => 'Alamat wajib diisi.',
            'city' => 'Kota wajib diisi.',
        ]);
});

test('rejects an invalid map link', function () {
    $this->post(route('admin.offices.store'), [
        'name' => 'Kantor Cabang',
        'type' => 'branch',
        'address' => 'Jl. Merdeka',
        'city' => 'Bandung',
        'map_url' => 'bukan link',
    ])->assertSessionHasErrors('map_url');
});

test('deletes an office', function () {
    $office = Office::factory()->create();

    $this->delete(route('admin.offices.destroy', $office))
        ->assertRedirect(route('admin.offices.index'));

    $this->assertModelMissing($office);
});
