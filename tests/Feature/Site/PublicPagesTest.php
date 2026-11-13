<?php

use App\Models\CaseStudy;
use App\Models\CaseStudyImage;
use App\Models\Industry;
use App\Models\Service;
use Inertia\Testing\AssertableInertia as Assert;

test('renders every public page with an existing page component', function (string $routeName, string $component) {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['home', 'site/home'],
    ['how-we-work', 'site/how-we-work'],
    ['services.index', 'site/services/index'],
    ['industries.index', 'site/industries/index'],
    ['case-studies.index', 'site/case-studies/index'],
    ['consultation.create', 'site/consultation/create'],
    ['consultation.thanks', 'site/consultation/thanks'],
]);

test('shows a published case study with its gallery', function () {
    $caseStudy = CaseStudy::factory()->create();
    CaseStudyImage::factory()->for($caseStudy)->create();

    $this->get(route('case-studies.show', $caseStudy->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/case-studies/show')
            ->where('caseStudy.id', $caseStudy->id)
            ->has('caseStudy.images', 1)
        );
});

test('returns 404 for a draft case study', function () {
    $caseStudy = CaseStudy::factory()->draft()->create();

    $this->get(route('case-studies.show', $caseStudy->slug))->assertNotFound();
});

test('lists only published case studies filtered by industry', function () {
    $industry = Industry::factory()->create();
    $matching = CaseStudy::factory()->for($industry)->create();
    CaseStudy::factory()->create();
    CaseStudy::factory()->draft()->for($industry)->create();

    $this->get(route('case-studies.index', ['industry' => $industry->slug]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('caseStudies.data', 1)
            ->where('caseStudies.data.0.id', $matching->id)
        );
});

test('shows published services and industries but not drafts', function () {
    $service = Service::factory()->create();
    $draftService = Service::factory()->draft()->create();
    $industry = Industry::factory()->create();
    $draftIndustry = Industry::factory()->draft()->create();

    $this->get(route('services.show', $service->slug))->assertOk();
    $this->get(route('services.show', $draftService->slug))->assertNotFound();
    $this->get(route('industries.show', $industry->slug))->assertOk();
    $this->get(route('industries.show', $draftIndustry->slug))->assertNotFound();
});
