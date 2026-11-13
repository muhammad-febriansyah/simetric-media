<?php

use App\Models\Expertise;
use App\Models\Service;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
    $this->expertise = Expertise::factory()->create(['name' => 'Pengembangan']);
});

test('lists services with their area of expertise', function () {
    Service::factory()->for($this->expertise)->create();

    $this->get(route('admin.services.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/services/index')
            ->where('services.0.expertise.name', 'Pengembangan')
        );
});

test('offers the areas of expertise in the service form', function () {
    $this->get(route('admin.services.create'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('expertiseOptions', fn ($options) => collect($options)->contains([
                'value' => (string) $this->expertise->id,
                'label' => 'Pengembangan',
            ]))
        );
});

test('creates a service with capabilities, methodology and a generated slug', function () {
    $this->post(route('admin.services.store'), [
        'name' => 'Integrasi Sistem & Otomasi',
        'expertise_id' => $this->expertise->id,
        'capabilities' => [
            ['title' => 'Integrasi API', 'description' => 'Menghubungkan ERP dan aplikasi operasional.'],
            ['title' => '', 'description' => ''],
        ],
        'methodology' => [
            ['title' => 'Pemetaan sistem', 'description' => ''],
        ],
        'meta_title' => 'Jasa Integrasi Sistem',
        'is_published' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.services.index'));

    $service = Service::query()->sole();

    expect($service->slug)->toBe('integrasi-sistem-otomasi')
        ->and($service->expertise_id)->toBe($this->expertise->id)
        ->and($service->capabilities)->toBe([['title' => 'Integrasi API', 'description' => 'Menghubungkan ERP dan aplikasi operasional.']])
        ->and($service->methodology)->toBe([['title' => 'Pemetaan sistem', 'description' => null]])
        ->and($service->meta_title)->toBe('Jasa Integrasi Sistem')
        ->and($service->isPublished())->toBeTrue();
});

test('requires a title for each capability that has a description', function () {
    $this->post(route('admin.services.store'), [
        'name' => 'Integrasi Sistem',
        'expertise_id' => $this->expertise->id,
        'capabilities' => [['title' => '', 'description' => 'Tanpa judul']],
    ])->assertSessionHasErrors(['capabilities.0.title' => 'Judul kemampuan wajib diisi.']);
});

test('rejects a meta description longer than 160 characters', function () {
    $this->post(route('admin.services.store'), [
        'name' => 'Integrasi Sistem',
        'expertise_id' => $this->expertise->id,
        'meta_description' => str_repeat('a', 161),
    ])->assertSessionHasErrors(['meta_description' => 'Meta description maksimal 160 karakter.']);
});

test('requires an existing area of expertise', function () {
    $this->post(route('admin.services.store'), ['name' => 'Layanan'])
        ->assertSessionHasErrors(['expertise_id' => 'Bidang keahlian wajib diisi.']);

    $this->post(route('admin.services.store'), ['name' => 'Layanan', 'expertise_id' => 999])
        ->assertSessionHasErrors(['expertise_id' => 'Bidang keahlian yang dipilih tidak valid.']);
});

test('unpublishes a service', function () {
    $service = Service::factory()->create();

    $this->put(route('admin.services.update', $service), [
        'name' => $service->name,
        'slug' => $service->slug,
        'expertise_id' => $service->expertise_id,
    ])->assertSessionHasNoErrors();

    expect($service->refresh()->published_at)->toBeNull();
});

test('deletes a service', function () {
    $service = Service::factory()->create();

    $this->delete(route('admin.services.destroy', $service))
        ->assertRedirect(route('admin.services.index'));

    $this->assertModelMissing($service);
});
