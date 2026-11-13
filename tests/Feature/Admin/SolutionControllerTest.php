<?php

use App\Enums\BusinessFunction;
use App\Models\Solution;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
});

test('creates a solution with features and a generated slug', function () {
    $this->post(route('admin.solutions.store'), [
        'name' => 'Otomasi Penagihan',
        'business_function' => 'finance',
        'features' => [
            ['title' => 'Invoice otomatis', 'description' => 'Dari order langsung jadi invoice.'],
            ['title' => '', 'description' => ''],
        ],
        'is_published' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.solutions.index'));

    $solution = Solution::query()->sole();

    expect($solution->slug)->toBe('otomasi-penagihan')
        ->and($solution->business_function)->toBe(BusinessFunction::Finance)
        ->and($solution->features)->toBe([['title' => 'Invoice otomatis', 'description' => 'Dari order langsung jadi invoice.']])
        ->and($solution->isPublished())->toBeTrue();
});

test('rejects an unknown business function', function () {
    $this->post(route('admin.solutions.store'), ['name' => 'Solusi', 'business_function' => 'marketing'])
        ->assertSessionHasErrors(['business_function' => 'Pilihan Divisi bisnis tidak valid.']);
});

test('updates and deletes a solution', function () {
    $solution = Solution::factory()->create();

    $this->put(route('admin.solutions.update', $solution), [
        'name' => 'Nama Baru',
        'slug' => $solution->slug,
        'business_function' => 'sales',
    ])->assertSessionHasNoErrors();

    expect($solution->refresh()->name)->toBe('Nama Baru')
        ->and($solution->published_at)->toBeNull();

    $this->delete(route('admin.solutions.destroy', $solution))->assertRedirect(route('admin.solutions.index'));
    $this->assertModelMissing($solution);
});
