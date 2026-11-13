<?php

namespace App\Http\Controllers\Site;

use App\Enums\ServicePillar;
use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * List published services grouped by pillar.
     */
    public function index(): Response
    {
        return Inertia::render('site/services/index', [
            'services' => ServiceResource::collection(
                Service::query()->published()->ordered()->get(),
            )->resolve(),
            'pillars' => ServicePillar::options(),
        ]);
    }

    /**
     * Show a published service with related case studies.
     */
    public function show(Service $service): Response
    {
        abort_unless($service->isPublished(), 404);

        return Inertia::render('site/services/show', [
            'service' => (new ServiceResource($service))->resolve(),
            'caseStudies' => CaseStudyResource::collection(
                $service->caseStudies()->published()->with('industry')->ordered()->limit(3)->get(),
            )->resolve(),
        ]);
    }
}
