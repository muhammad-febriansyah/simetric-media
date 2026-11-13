<?php

use App\Models\CaseStudy;
use App\Models\Industry;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
});

test('lists industries with their case study count', function () {
    $industry = Industry::factory()->create();
    CaseStudy::factory()->count(2)->for($industry)->create();

    $this->get(route('admin.industries.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/industries/index')
            ->where('industries.0.case_studies_count', 2)
        );
});

test('creates an industry with one pain point per line', function () {
    $this->post(route('admin.industries.store'), [
        'name' => 'Manufaktur',
        'pain_points' => "Data produksi manual\r\nStok tidak sinkron",
        'is_published' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.industries.index'));

    $industry = Industry::query()->sole();

    expect($industry->slug)->toBe('manufaktur')
        ->and($industry->pain_points)->toBe(['Data produksi manual', 'Stok tidak sinkron']);
});

test('requires a name', function () {
    $this->post(route('admin.industries.store'), [])
        ->assertSessionHasErrors(['name' => 'Nama industri wajib diisi.']);
});

test('updates an industry', function () {
    $industry = Industry::factory()->create();

    $this->put(route('admin.industries.update', $industry), [
        'name' => 'Konstruksi',
        'slug' => 'konstruksi',
        'is_published' => '1',
    ])->assertSessionHasNoErrors();

    expect($industry->refresh()->name)->toBe('Konstruksi');
});

test('keeps case studies when their industry is deleted', function () {
    $industry = Industry::factory()->create();
    $caseStudy = CaseStudy::factory()->for($industry)->create();

    $this->delete(route('admin.industries.destroy', $industry))
        ->assertRedirect(route('admin.industries.index'));

    $this->assertModelMissing($industry);
    expect($caseStudy->refresh()->industry_id)->toBeNull();
});
