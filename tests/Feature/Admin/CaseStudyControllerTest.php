<?php

use App\Enums\OrganizationType;
use App\Models\CaseStudy;
use App\Models\CaseStudyImage;
use App\Models\Industry;
use App\Models\Service;
use App\Models\Solution;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
    Storage::fake('public');
});

/**
 * @return array<string, mixed>
 */
function validCaseStudyPayload(array $overrides = []): array
{
    return [
        'title' => 'Digitalisasi Gudang Distributor',
        'client_name' => 'Distributor FMCG',
        'challenge' => 'Stok gudang tidak sinkron.',
        'solution' => 'Aplikasi gudang terintegrasi.',
        'is_published' => '1',
        ...$overrides,
    ];
}

describe('index', function () {
    test('lists published and draft case studies', function () {
        CaseStudy::factory()->create();
        CaseStudy::factory()->draft()->create();

        $this->get(route('admin.case-studies.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/case-studies/index')
                ->has('caseStudies', 2)
            );
    });
});

describe('store', function () {
    test('creates a published case study with services, results and a cover image', function () {
        $industry = Industry::factory()->create();
        $services = Service::factory()->count(2)->create();

        $this->post(route('admin.case-studies.store'), validCaseStudyPayload([
            'industry_id' => $industry->id,
            'service_ids' => $services->pluck('id')->all(),
            'cover_image' => UploadedFile::fake()->image('cover.jpg'),
            'results' => [
                ['label' => 'Selisih stok', 'value' => '-80%'],
                ['label' => '', 'value' => ''],
            ],
            'is_featured' => '1',
        ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.case-studies.index'));

        $caseStudy = CaseStudy::query()->sole();

        expect($caseStudy->slug)->toBe('digitalisasi-gudang-distributor')
            ->and($caseStudy->industry_id)->toBe($industry->id)
            ->and($caseStudy->results)->toBe([['label' => 'Selisih stok', 'value' => '-80%']])
            ->and($caseStudy->is_featured)->toBeTrue()
            ->and($caseStudy->isPublished())->toBeTrue()
            ->and($caseStudy->services()->pluck('services.id')->sort()->values()->all())
            ->toBe($services->pluck('id')->sort()->values()->all());

        Storage::disk('public')->assertExists($caseStudy->cover_image);
    });

    test('saves a draft when publishing is unchecked', function () {
        $this->post(route('admin.case-studies.store'), validCaseStudyPayload(['is_published' => null]))
            ->assertSessionHasNoErrors();

        expect(CaseStudy::query()->sole()->published_at)->toBeNull();
    });

    test('requires the title, client, challenge and solution', function () {
        $this->post(route('admin.case-studies.store'), [])
            ->assertSessionHasErrors([
                'title' => 'Judul wajib diisi.',
                'client_name' => 'Nama klien wajib diisi.',
                'challenge' => 'Tantangan wajib diisi.',
                'solution' => 'Solusi wajib diisi.',
            ]);
    });

    test('rejects a slug that is already used', function () {
        CaseStudy::factory()->create(['slug' => 'digitalisasi-gudang-distributor']);

        $this->post(route('admin.case-studies.store'), validCaseStudyPayload())
            ->assertSessionHasErrors(['slug' => 'Slug sudah dipakai.']);
    });

    test('rejects a cover that is not an image', function () {
        $this->post(route('admin.case-studies.store'), validCaseStudyPayload([
            'cover_image' => UploadedFile::fake()->create('cover.pdf', 100, 'application/pdf'),
        ]))->assertSessionHasErrors(['cover_image' => 'Gambar cover harus berupa gambar.']);
    });
});

describe('update', function () {
    test('replaces the cover image and deletes the previous file', function () {
        $oldCover = UploadedFile::fake()->image('old.jpg')->store('case-studies', 'public');
        $caseStudy = CaseStudy::factory()->create(['cover_image' => $oldCover, 'slug' => 'lama']);

        $this->put(route('admin.case-studies.update', $caseStudy), validCaseStudyPayload([
            'slug' => 'lama',
            'cover_image' => UploadedFile::fake()->image('new.jpg'),
        ]))->assertSessionHasNoErrors();

        $caseStudy->refresh();

        Storage::disk('public')->assertMissing($oldCover);
        Storage::disk('public')->assertExists($caseStudy->cover_image);
        expect($caseStudy->cover_image)->not->toBe($oldCover);
    });

    test('removes the cover image when requested', function () {
        $cover = UploadedFile::fake()->image('cover.jpg')->store('case-studies', 'public');
        $caseStudy = CaseStudy::factory()->create(['cover_image' => $cover]);

        $this->put(route('admin.case-studies.update', $caseStudy), validCaseStudyPayload([
            'remove_cover_image' => '1',
        ]))->assertSessionHasNoErrors();

        expect($caseStudy->refresh()->cover_image)->toBeNull();
        Storage::disk('public')->assertMissing($cover);
    });

    test('keeps the original publication date when it stays published', function () {
        $publishedAt = Carbon::parse('2026-01-15 08:00:00');
        $caseStudy = CaseStudy::factory()->create(['published_at' => $publishedAt]);

        $this->put(route('admin.case-studies.update', $caseStudy), validCaseStudyPayload())
            ->assertSessionHasNoErrors();

        expect($caseStudy->refresh()->published_at->equalTo($publishedAt))->toBeTrue();
    });

    test('allows keeping its own slug', function () {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'digitalisasi-gudang-distributor']);

        $this->put(route('admin.case-studies.update', $caseStudy), validCaseStudyPayload())
            ->assertSessionHasNoErrors();
    });
});

describe('details', function () {
    test('stores the project period, organization type and key insights', function () {
        $this->post(route('admin.case-studies.store'), validCaseStudyPayload([
            'project_period' => '2025 - Sekarang',
            'organization_type' => 'state_owned',
            'key_insights' => [
                ['title' => 'Mulai dari standar data', 'description' => 'Tanpa standar, laporan berbeda-beda.'],
                ['title' => '', 'description' => ''],
            ],
        ]))->assertSessionHasNoErrors();

        $caseStudy = CaseStudy::query()->sole();

        expect($caseStudy->project_period)->toBe('2025 - Sekarang')
            ->and($caseStudy->organization_type)->toBe(OrganizationType::StateOwned)
            ->and($caseStudy->key_insights)->toBe([['title' => 'Mulai dari standar data', 'description' => 'Tanpa standar, laporan berbeda-beda.']]);
    });

    test('rejects an unknown organization type', function () {
        $this->post(route('admin.case-studies.store'), validCaseStudyPayload(['organization_type' => 'alien']))
            ->assertSessionHasErrors(['organization_type' => 'Pilihan Tipe organisasi tidak valid.']);
    });
});

describe('gallery', function () {
    test('appends uploaded gallery images', function () {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'digitalisasi-gudang-distributor']);
        CaseStudyImage::factory()->for($caseStudy)->create(['sort_order' => 3]);

        $this->put(route('admin.case-studies.update', $caseStudy), validCaseStudyPayload([
            'gallery_images' => [UploadedFile::fake()->image('a.jpg'), UploadedFile::fake()->image('b.jpg')],
        ]))->assertSessionHasNoErrors();

        $newImages = $caseStudy->images()->where('sort_order', '>', 3)->get();

        expect($caseStudy->images()->count())->toBe(3)
            ->and($newImages->pluck('sort_order')->all())->toBe([4, 5]);

        $newImages->each(fn (CaseStudyImage $image) => Storage::disk('public')->assertExists($image->path));
    });

    test('removes selected gallery images and their files', function () {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'digitalisasi-gudang-distributor']);
        $path = UploadedFile::fake()->image('old.jpg')->store('case-studies/gallery', 'public');
        $removed = CaseStudyImage::factory()->for($caseStudy)->create(['path' => $path]);
        $kept = CaseStudyImage::factory()->for($caseStudy)->create();

        $this->put(route('admin.case-studies.update', $caseStudy), validCaseStudyPayload([
            'remove_image_ids' => [$removed->id],
        ]))->assertSessionHasNoErrors();

        $this->assertModelMissing($removed);
        $this->assertModelExists($kept);
        Storage::disk('public')->assertMissing($path);
    });

    test('saves the caption and order of existing gallery images', function () {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'digitalisasi-gudang-distributor']);
        $image = CaseStudyImage::factory()->for($caseStudy)->create(['caption' => null, 'sort_order' => 0]);

        $this->put(route('admin.case-studies.update', $caseStudy), validCaseStudyPayload([
            'image_captions' => [$image->id => 'Dashboard produksi'],
            'image_sort_orders' => [$image->id => 4],
        ]))->assertSessionHasNoErrors();

        expect($image->refresh()->caption)->toBe('Dashboard produksi')
            ->and($image->sort_order)->toBe(4);
    });

    test('links the selected solutions', function () {
        $solution = Solution::factory()->create();

        $this->post(route('admin.case-studies.store'), validCaseStudyPayload([
            'solution_ids' => [$solution->id],
        ]))->assertSessionHasNoErrors();

        expect(CaseStudy::query()->sole()->solutions()->pluck('solutions.id')->all())->toBe([$solution->id]);
    });

    test('ignores image ids that belong to another case study', function () {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'digitalisasi-gudang-distributor']);
        $otherImage = CaseStudyImage::factory()->create();

        $this->put(route('admin.case-studies.update', $caseStudy), validCaseStudyPayload([
            'remove_image_ids' => [$otherImage->id],
        ]))->assertSessionHasNoErrors();

        $this->assertModelExists($otherImage);
    });
});

describe('destroy', function () {
    test('soft deletes the case study', function () {
        $caseStudy = CaseStudy::factory()->create();

        $this->delete(route('admin.case-studies.destroy', $caseStudy))
            ->assertRedirect(route('admin.case-studies.index'));

        $this->assertSoftDeleted($caseStudy);
    });
});
