<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Http\Resources\ClientLogoResource;
use App\Http\Resources\ExpertiseResource;
use App\Http\Resources\FaqResource;
use App\Http\Resources\IndustryResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\TestimonialResource;
use App\Models\CaseStudy;
use App\Models\ClientLogo;
use App\Models\Expertise;
use App\Models\Faq;
use App\Models\Industry;
use App\Models\Product;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Show the public home page.
     */
    public function __invoke(): Response
    {
        $publishedServices = fn (Builder|HasMany $query) => $query->published();

        return Inertia::render('site/home', [
            'process' => config('company.process'),
            'stats' => [
                'caseStudies' => CaseStudy::query()->published()->count(),
                'products' => Product::query()->published()->count(),
                'industries' => Industry::query()->published()->count(),
                'clients' => ClientLogo::query()->where('is_active', true)->count(),
            ],
            'expertises' => ExpertiseResource::collection(
                Expertise::query()
                    ->published()
                    ->whereHas('services', $publishedServices)
                    ->withCount(['services' => $publishedServices])
                    ->with(['services' => fn (HasMany $query) => $query->published()->ordered()])
                    ->ordered()
                    ->get(),
            )->resolve(),
            'industries' => IndustryResource::collection(
                Industry::query()->published()->ordered()->get(),
            )->resolve(),
            'featuredCaseStudies' => CaseStudyResource::collection(
                CaseStudy::query()->published()->where('is_featured', true)->with('industry')->ordered()->limit(3)->get(),
            )->resolve(),
            'products' => ProductResource::collection(
                Product::query()->published()->where('is_featured', true)->ordered()->limit(6)->get(),
            )->resolve(),
            'clientLogos' => ClientLogoResource::collection(
                ClientLogo::query()->where('is_active', true)->orderBy('sort_order')->orderBy('name')->get(),
            )->resolve(),
            'testimonials' => TestimonialResource::collection(
                Testimonial::query()->where('is_active', true)->orderBy('sort_order')->limit(12)->get(),
            )->resolve(),
            'faqs' => FaqResource::collection(
                Faq::query()->where('page', 'home')->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(),
            )->resolve(),
        ]);
    }
}
