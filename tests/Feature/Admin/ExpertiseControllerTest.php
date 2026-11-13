<?php

use App\Models\Expertise;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
});

test('lists areas of expertise with their service count', function () {
    $expertise = Expertise::factory()->create(['sort_order' => 99]);
    Service::factory()->count(2)->for($expertise)->create();

    $this->get(route('admin.expertises.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/expertises/index')
            ->where('expertises', fn ($expertises) => collect($expertises)->firstWhere('id', $expertise->id)['services_count'] === 2)
        );
});

test('creates an area of expertise with a generated slug', function () {
    $this->post(route('admin.expertises.store'), [
        'name' => 'Data & AI',
        'description' => 'Memanfaatkan data operasional untuk prediksi dan otomasi.',
        'icon' => 'zap',
        'is_published' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.expertises.index'));

    $expertise = Expertise::query()->where('slug', 'data-ai')->sole();

    expect($expertise->name)->toBe('Data & AI')
        ->and($expertise->isPublished())->toBeTrue();
});

test('validates the area of expertise form', function () {
    Expertise::factory()->create(['slug' => 'data-ai']);

    $this->post(route('admin.expertises.store'), [
        'slug' => 'data-ai',
        'description' => str_repeat('a', 301),
    ])->assertSessionHasErrors([
        'name' => 'Nama bidang wajib diisi.',
        'slug',
        'description' => 'Deskripsi maksimal 300 karakter.',
    ]);
});

test('updates an area of expertise and keeps its own slug', function () {
    $expertise = Expertise::factory()->create(['slug' => 'desain-produk']);

    $this->put(route('admin.expertises.update', $expertise), [
        'name' => 'Desain Produk Digital',
        'slug' => 'desain-produk',
        'description' => 'Deskripsi baru.',
    ])->assertSessionHasNoErrors();

    expect($expertise->refresh()->name)->toBe('Desain Produk Digital')
        ->and($expertise->isPublished())->toBeFalse();
});

test('deletes an area of expertise without services', function () {
    $expertise = Expertise::factory()->create();

    $this->delete(route('admin.expertises.destroy', $expertise))
        ->assertRedirect(route('admin.expertises.index'));

    $this->assertModelMissing($expertise);
});

test('refuses to delete an area of expertise that still groups services', function () {
    $expertise = Expertise::factory()->create();
    Service::factory()->for($expertise)->create();

    $this->delete(route('admin.expertises.destroy', $expertise))
        ->assertRedirect(route('admin.expertises.index'))
        ->assertInertiaFlash('toast.type', 'error');

    $this->assertModelExists($expertise);
});

test('the migration links existing services to the former pillar', function () {
    $migration = require database_path('migrations/2026_11_13_161040_create_expertises_table.php');
    $migration->down();

    DB::table('services')->insert([
        ['name' => 'Desain UI', 'slug' => 'desain-ui', 'pillar' => 'design', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Support', 'slug' => 'support-app', 'pillar' => 'support', 'created_at' => now(), 'updated_at' => now()],
    ]);

    $migration->up();

    expect(Service::query()->where('slug', 'desain-ui')->sole()->expertise->slug)->toBe('design')
        ->and(Service::query()->where('slug', 'support-app')->sole()->expertise->name)->toBe('Pendampingan')
        ->and(Expertise::query()->count())->toBe(4);
});
