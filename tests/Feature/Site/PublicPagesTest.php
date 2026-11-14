<?php

use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\CaseStudyImage;
use App\Models\ClientLogo;
use App\Models\Expertise;
use App\Models\Industry;
use App\Models\Product;
use App\Models\Service;
use App\Models\Testimonial;
use Inertia\Testing\AssertableInertia as Assert;

test('renders every public page with an existing page component', function (string $routeName, string $component) {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['home', 'site/home'],
    ['how-we-work', 'site/how-we-work'],
    ['expertises.index', 'site/expertises/index'],
    ['insights.index', 'site/insights/index'],
    ['industries.index', 'site/industries/index'],
    ['case-studies.index', 'site/case-studies/index'],
    ['products.index', 'site/products/index'],
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

test('shows published products but not drafts', function () {
    $product = Product::factory()->create();
    $otherProduct = Product::factory()->create();
    $draftProduct = Product::factory()->draft()->create();

    $this->get(route('products.index'))
        ->assertInertia(fn (Assert $page) => $page->has('products', 2));

    $this->get(route('products.show', $product->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/products/show')
            ->where('product.id', $product->id)
            ->has('otherProducts', 1)
            ->where('otherProducts.0.id', $otherProduct->id)
        );

    $this->get(route('products.show', $draftProduct->slug))->assertNotFound();
});

test('shows only featured published products on the home page', function () {
    $featured = Product::factory()->featured()->create();
    Product::factory()->create();
    Product::factory()->featured()->draft()->create();

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 1)
            ->where('products.0.id', $featured->id)
        );
});

test('shows the active client logos and testimonials of a product on its page', function () {
    $product = Product::factory()->create();
    $logo = ClientLogo::factory()->for($product)->create();
    ClientLogo::factory()->for($product)->create(['is_active' => false]);
    ClientLogo::factory()->create();
    $testimonial = Testimonial::factory()->for($product)->create();
    Testimonial::factory()->for($product)->create(['is_active' => false]);

    $this->get(route('products.show', $product->slug))
        ->assertInertia(fn (Assert $page) => $page
            ->has('clientLogos', 1)
            ->where('clientLogos.0.id', $logo->id)
            ->has('testimonials', 1)
            ->where('testimonials.0.id', $testimonial->id)
        );
});

test('shows published areas of expertise with their published services and related insights', function () {
    $expertise = Expertise::factory()->create(['sort_order' => 0]);
    $service = Service::factory()->for($expertise)->create();
    Service::factory()->draft()->for($expertise)->create();
    $emptyExpertise = Expertise::factory()->create();
    $draftExpertise = Expertise::factory()->draft()->create();
    Service::factory()->for($draftExpertise)->create();
    $article = Article::factory()->create();
    $article->services()->attach($service);
    Article::factory()->create();

    $this->get(route('expertises.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/expertises/index')
            ->has('intro.title')
            ->where('expertises', function ($expertises) use ($expertise, $emptyExpertise, $draftExpertise, $service) {
                $ids = collect($expertises)->pluck('id');
                $shown = collect($expertises)->firstWhere('id', $expertise->id);

                return $ids->contains($expertise->id)
                    && ! $ids->contains($emptyExpertise->id)
                    && ! $ids->contains($draftExpertise->id)
                    && collect($shown['services'])->pluck('id')->all() === [$service->id];
            })
            ->has('articles', 1)
            ->where('articles.0.id', $article->id)
        );
});

test('redirects the former service URLs permanently', function () {
    $service = Service::factory()->create();

    $this->get('/layanan')->assertStatus(301)->assertRedirect('/keahlian');
    $this->get("/layanan/{$service->slug}")->assertStatus(301)->assertRedirect(route('services.show', $service->slug));
});

test('shows a published insight with its services but not drafts', function () {
    $service = Service::factory()->create();
    $article = Article::factory()->create(['category' => 'Strategi']);
    $article->services()->attach($service);
    $draft = Article::factory()->draft()->create();

    $this->get(route('insights.show', $article->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/insights/show')
            ->where('article.id', $article->id)
            ->where('article.services.0.id', $service->id)
        );

    $this->get(route('insights.show', $draft->slug))->assertNotFound();
});

test('filters insights by category', function () {
    $strategy = Article::factory()->create(['category' => 'Strategi']);
    Article::factory()->create(['category' => 'Teknologi']);

    $this->get(route('insights.index', ['category' => 'Strategi']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('articles.data', 1)
            ->where('articles.data.0.id', $strategy->id)
            ->where('categories', ['Strategi', 'Teknologi'])
        );
});

test('feeds the home page with active logos and testimonials, published expertise and real counts', function () {
    $industry = Industry::factory()->create();
    Industry::factory()->draft()->create();
    CaseStudy::factory()->count(2)->for($industry)->create();
    CaseStudy::factory()->draft()->create();
    $product = Product::factory()->create();
    Product::factory()->draft()->create();
    $logo = ClientLogo::factory()->create();
    ClientLogo::factory()->create(['is_active' => false]);
    $testimonial = Testimonial::factory()->create();
    Testimonial::factory()->create(['is_active' => false]);
    $expertise = Expertise::factory()->create();
    Service::factory()->for($expertise)->create();
    Service::factory()->draft()->for($expertise)->create();
    $draftExpertise = Expertise::factory()->draft()->create();
    Service::factory()->for($draftExpertise)->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats', [
                'caseStudies' => 2,
                'products' => 1,
                'industries' => Industry::query()->published()->count(),
                'clients' => 1,
            ])
            ->where('clientLogos', fn ($logos) => collect($logos)->pluck('id')->all() === [$logo->id])
            ->where('testimonials', fn ($testimonials) => collect($testimonials)->pluck('id')->all() === [$testimonial->id])
            ->where('expertises', function ($expertises) use ($expertise, $draftExpertise) {
                $shown = collect($expertises)->firstWhere('id', $expertise->id);

                return $shown['services_count'] === 1
                    && ! collect($expertises)->contains('id', $draftExpertise->id);
            })
        );
});
