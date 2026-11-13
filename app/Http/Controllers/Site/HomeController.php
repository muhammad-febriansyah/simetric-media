<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Http\Resources\IndustryResource;
use App\Http\Resources\ServiceResource;
use App\Models\CaseStudy;
use App\Models\Industry;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Show the public home page.
     */
    public function __invoke(): Response
    {
        return Inertia::render('site/home', [
            'process' => config('company.process'),
            'services' => ServiceResource::collection(
                Service::query()->published()->ordered()->limit(6)->get(),
            )->resolve(),
            'industries' => IndustryResource::collection(
                Industry::query()->published()->ordered()->get(),
            )->resolve(),
            'featuredCaseStudies' => CaseStudyResource::collection(
                CaseStudy::query()->published()->where('is_featured', true)->with('industry')->ordered()->limit(3)->get(),
            )->resolve(),
        ]);
    }
}
