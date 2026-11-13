<?php

use App\Enums\ServicePillar;
use App\Models\Service;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
});

test('lists services with their pillar', function () {
    Service::factory()->create(['pillar' => ServicePillar::Design]);

    $this->get(route('admin.services.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/services/index')
            ->where('services.0.pillar.value', 'design')
        );
});

test('creates a service with capabilities, methodology and a generated slug', function () {
    $this->post(route('admin.services.store'), [
        'name' => 'Integrasi Sistem & Otomasi',
        'pillar' => 'development',
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
        ->and($service->pillar)->toBe(ServicePillar::Development)
        ->and($service->capabilities)->toBe([['title' => 'Integrasi API', 'description' => 'Menghubungkan ERP dan aplikasi operasional.']])
        ->and($service->methodology)->toBe([['title' => 'Pemetaan sistem', 'description' => null]])
        ->and($service->meta_title)->toBe('Jasa Integrasi Sistem')
        ->and($service->isPublished())->toBeTrue();
});

test('requires a title for each capability that has a description', function () {
    $this->post(route('admin.services.store'), [
        'name' => 'Integrasi Sistem',
        'pillar' => 'development',
        'capabilities' => [['title' => '', 'description' => 'Tanpa judul']],
    ])->assertSessionHasErrors(['capabilities.0.title' => 'Judul kemampuan wajib diisi.']);
});

test('rejects a meta description longer than 160 characters', function () {
    $this->post(route('admin.services.store'), [
        'name' => 'Integrasi Sistem',
        'pillar' => 'development',
        'meta_description' => str_repeat('a', 161),
    ])->assertSessionHasErrors(['meta_description' => 'Meta description maksimal 160 karakter.']);
});

test('rejects an unknown pillar', function () {
    $this->post(route('admin.services.store'), ['name' => 'Layanan', 'pillar' => 'marketing'])
        ->assertSessionHasErrors(['pillar' => 'Pilihan Pilar layanan tidak valid.']);
});

test('unpublishes a service', function () {
    $service = Service::factory()->create();

    $this->put(route('admin.services.update', $service), [
        'name' => $service->name,
        'slug' => $service->slug,
        'pillar' => $service->pillar->value,
    ])->assertSessionHasNoErrors();

    expect($service->refresh()->published_at)->toBeNull();
});

test('deletes a service', function () {
    $service = Service::factory()->create();

    $this->delete(route('admin.services.destroy', $service))
        ->assertRedirect(route('admin.services.index'));

    $this->assertModelMissing($service);
});
