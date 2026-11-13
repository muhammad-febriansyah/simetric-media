<?php

use App\Models\CompanyMilestone;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
});

test('lists milestones in chronological order', function () {
    CompanyMilestone::factory()->create(['year' => 2024]);
    CompanyMilestone::factory()->create(['year' => 2018]);

    $this->get(route('admin.milestones.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/milestones/index')
            ->where('milestones.0.year', 2018)
            ->where('milestones.1.year', 2024)
        );
});

test('creates a milestone', function () {
    $this->post(route('admin.milestones.store'), [
        'year' => 2020,
        'title' => 'Fokus menjadi konsultan',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.milestones.index'));

    expect(CompanyMilestone::query()->sole()->title)->toBe('Fokus menjadi konsultan');
});

test('rejects a year in the far future', function () {
    $this->post(route('admin.milestones.store'), [
        'year' => now()->year + 5,
        'title' => 'Masa depan',
    ])->assertSessionHasErrors('year');
});

test('updates and deletes a milestone', function () {
    $milestone = CompanyMilestone::factory()->create();

    $this->put(route('admin.milestones.update', $milestone), ['year' => 2019, 'title' => 'Judul baru'])
        ->assertSessionHasNoErrors();
    expect($milestone->refresh()->year)->toBe(2019);

    $this->delete(route('admin.milestones.destroy', $milestone))
        ->assertRedirect(route('admin.milestones.index'));
    $this->assertModelMissing($milestone);
});
