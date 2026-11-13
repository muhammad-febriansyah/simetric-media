<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Models\CaseStudy;
use App\Models\Industry;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CaseStudyController extends Controller
{
    /**
     * List published case studies, filterable by industry and service.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'industry' => ['nullable', 'string', 'max:120'],
            'service' => ['nullable', 'string', 'max:170'],
        ]);

        $caseStudies = CaseStudy::query()
            ->published()
            ->with('industry')
            ->when($filters['industry'] ?? null, fn (Builder $query, string $slug) => $query->whereRelation('industry', 'slug', $slug))
            ->when($filters['service'] ?? null, fn (Builder $query, string $slug) => $query->whereRelation('services', 'slug', $slug))
            ->ordered()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('site/case-studies/index', [
            'caseStudies' => [
                'data' => CaseStudyResource::collection($caseStudies->items())->resolve(),
                'meta' => [
                    'current_page' => $caseStudies->currentPage(),
                    'last_page' => $caseStudies->lastPage(),
                    'total' => $caseStudies->total(),
                ],
            ],
            'filters' => [
                'industry' => $filters['industry'] ?? '',
                'service' => $filters['service'] ?? '',
            ],
            'industryOptions' => Industry::query()->published()->ordered()->get(['slug', 'name'])
                ->map(fn (Industry $industry): array => ['value' => $industry->slug, 'label' => $industry->name]),
            'serviceOptions' => Service::query()->published()->ordered()->get(['slug', 'name'])
                ->map(fn (Service $service): array => ['value' => $service->slug, 'label' => $service->name]),
        ]);
    }

    /**
     * Show a published case study structured by consulting stage.
     */
    public function show(CaseStudy $caseStudy): Response
    {
        abort_unless($caseStudy->isPublished(), 404);

        $caseStudy->load(['industry', 'services', 'images']);

        return Inertia::render('site/case-studies/show', [
            'caseStudy' => (new CaseStudyResource($caseStudy))->resolve(),
            'relatedCaseStudies' => CaseStudyResource::collection(
                CaseStudy::query()
                    ->published()
                    ->with('industry')
                    ->whereKeyNot($caseStudy->id)
                    ->when($caseStudy->industry_id, fn (Builder $query, int $industryId) => $query->orderByRaw('industry_id = ? desc', [$industryId]))
                    ->ordered()
                    ->limit(3)
                    ->get(),
            )->resolve(),
        ]);
    }
}
