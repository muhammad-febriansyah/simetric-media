<?php

use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\ClientLogo;
use App\Models\CompanyMilestone;
use App\Models\ConsultationRequest;
use App\Models\Faq;
use App\Models\Industry;
use App\Models\LeadActivity;
use App\Models\Office;
use App\Models\Service;
use App\Models\Solution;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DemoSeeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Http::preventStrayRequests();
});

test('seeds 20 demo records per menu with stored images', function () {
    Http::fake(['*' => Http::response('fake-image-bytes')]);
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    foreach ([Industry::class, Service::class, Faq::class, Article::class, TeamMember::class,
        CompanyMilestone::class, Office::class, ConsultationRequest::class] as $model) {
        expect($model::query()->count())->toBe(20, $model);
    }

    // Real product partners and testimonials from ProductSeeder come on top of the 20 demo records.
    expect(Testimonial::query()->whereNull('product_id')->count())->toBe(20)
        ->and(ClientLogo::query()->whereNull('product_id')->count())->toBe(20)
        ->and(Solution::query()->count())->toBeGreaterThanOrEqual(20)
        ->and(CaseStudy::query()->count())->toBeGreaterThanOrEqual(20)
        ->and(CaseStudy::query()->whereNull('cover_image')->exists())->toBeFalse()
        ->and(Article::query()->whereNull('cover_image')->exists())->toBeFalse()
        ->and(TeamMember::query()->whereNull('photo')->exists())->toBeFalse();

    Storage::disk('public')->assertExists([
        CaseStudy::query()->value('cover_image'),
        TeamMember::query()->value('photo'),
        ClientLogo::query()->value('logo'),
    ]);
});

test('can be run again without duplicating records', function () {
    Http::fake(['*' => Http::response('fake-image-bytes')]);
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);
    $leadActivities = LeadActivity::query()->count();

    $this->seed(DemoSeeder::class);

    expect(CaseStudy::query()->count())->toBeGreaterThanOrEqual(20)->toBeLessThanOrEqual(23)
        ->and(ConsultationRequest::query()->count())->toBe(20)
        ->and(LeadActivity::query()->count())->toBe($leadActivities);
});

test('keeps seeding when image downloads fail', function () {
    Http::fake(['*' => Http::response(status: 500)]);

    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    expect(Article::query()->count())->toBe(20)
        ->and(Article::query()->whereNotNull('cover_image')->exists())->toBeFalse();
});
