<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CaseStudyResource;
use App\Http\Resources\FaqResource;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Show a published service with related case studies and insights.
     */
    public function show(Service $service): Response
    {
        abort_unless($service->isPublished(), 404);

        $service->load('expertise');

        return Inertia::render('site/services/show', [
            'service' => (new ServiceResource($service))->resolve(),
            'articles' => ArticleResource::collection(
                $service->articles()->published()->latest('published_at')->limit(3)->get(),
            )->resolve(),
            'caseStudies' => CaseStudyResource::collection(
                $service->caseStudies()->published()->with('industry')->ordered()->limit(3)->get(),
            )->resolve(),
            'faqs' => FaqResource::collection(
                $service->faqs()->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(),
            )->resolve(),
        ]);
    }
}
