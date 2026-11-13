<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Http\Resources\IndustryResource;
use App\Models\Industry;
use Inertia\Inertia;
use Inertia\Response;

class IndustryController extends Controller
{
    /**
     * List published industries.
     */
    public function index(): Response
    {
        return Inertia::render('site/industries/index', [
            'industries' => IndustryResource::collection(
                Industry::query()->published()->ordered()->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show an industry's common problems and related case studies.
     */
    public function show(Industry $industry): Response
    {
        abort_unless($industry->isPublished(), 404);

        return Inertia::render('site/industries/show', [
            'industry' => (new IndustryResource($industry))->resolve(),
            'caseStudies' => CaseStudyResource::collection(
                $industry->caseStudies()->published()->with('industry')->ordered()->limit(6)->get(),
            )->resolve(),
        ]);
    }
}
