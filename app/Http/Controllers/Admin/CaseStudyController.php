<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrganizationType;
use App\Http\Controllers\Admin\Concerns\StoresPublicImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CaseStudyRequest;
use App\Http\Resources\CaseStudyResource;
use App\Models\CaseStudy;
use App\Models\CaseStudyImage;
use App\Models\Industry;
use App\Models\Service;
use App\Models\Solution;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CaseStudyController extends Controller
{
    use StoresPublicImages;

    /**
     * List all case studies.
     */
    public function index(): Response
    {
        return Inertia::render('admin/case-studies/index', [
            'caseStudies' => CaseStudyResource::collection(
                CaseStudy::query()->with('industry')->ordered()->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the form for creating a case study.
     */
    public function create(): Response
    {
        return Inertia::render('admin/case-studies/form', [
            'caseStudy' => null,
            ...$this->formOptions(),
        ]);
    }

    /**
     * Store a new case study with its cover and gallery images.
     */
    public function store(CaseStudyRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $caseStudy = CaseStudy::query()->create([
                ...$this->contentAttributes($request),
                'cover_image' => $request->file('cover_image')?->store('case-studies', 'public'),
                'published_at' => $request->publishedAt(),
            ]);

            $caseStudy->services()->sync($request->validated('service_ids', []));
            $caseStudy->solutions()->sync($request->validated('solution_ids', []));
            $this->storeGalleryImages($request, $caseStudy);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Studi kasus berhasil ditambahkan.']);

        return to_route('admin.case-studies.index');
    }

    /**
     * Show the form for editing a case study.
     */
    public function edit(CaseStudy $caseStudy): Response
    {
        $caseStudy->load(['industry', 'services', 'solutions', 'images']);

        return Inertia::render('admin/case-studies/form', [
            'caseStudy' => (new CaseStudyResource($caseStudy))->resolve(),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update a case study: replace or remove the cover, add or remove gallery images.
     */
    public function update(CaseStudyRequest $request, CaseStudy $caseStudy): RedirectResponse
    {
        [$coverImage, $previousCoverImage] = $this->resolveImage($request, 'cover_image', $caseStudy->cover_image, 'case-studies', 'remove_cover_image');

        $removedImages = $caseStudy->images()->whereKey($request->validated('remove_image_ids', []))->get();

        DB::transaction(function () use ($request, $caseStudy, $coverImage, $removedImages): void {
            $caseStudy->update([
                ...$this->contentAttributes($request),
                'cover_image' => $coverImage,
                'published_at' => $request->publishedAt($caseStudy->published_at),
            ]);

            $caseStudy->services()->sync($request->validated('service_ids', []));
            $caseStudy->solutions()->sync($request->validated('solution_ids', []));
            $caseStudy->images()->whereKey($removedImages->modelKeys())->delete();
            $this->updateGalleryDetails($request, $caseStudy);
            $this->storeGalleryImages($request, $caseStudy);
        });

        $this->deletePublicFiles($previousCoverImage, ...$removedImages->pluck('path')->all());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Studi kasus berhasil diperbarui.']);

        return to_route('admin.case-studies.index');
    }

    /**
     * Soft delete a case study.
     */
    public function destroy(CaseStudy $caseStudy): RedirectResponse
    {
        $caseStudy->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Studi kasus berhasil dihapus.']);

        return to_route('admin.case-studies.index');
    }

    /**
     * Content fields shared by store and update.
     *
     * @return array<string, mixed>
     */
    private function contentAttributes(CaseStudyRequest $request): array
    {
        return [
            ...$request->safe()->except([
                'service_ids', 'solution_ids', 'cover_image', 'remove_cover_image', 'gallery_images',
                'remove_image_ids', 'image_captions', 'image_sort_orders', 'is_published',
            ]),
            'results' => $request->validated('results', []),
            'key_insights' => $request->validated('key_insights', []),
            'is_featured' => $request->boolean('is_featured'),
            'sort_order' => $request->integer('sort_order'),
        ];
    }

    /**
     * Save the caption and order typed for each existing gallery image.
     */
    private function updateGalleryDetails(CaseStudyRequest $request, CaseStudy $caseStudy): void
    {
        $captions = $request->validated('image_captions', []);
        $sortOrders = $request->validated('image_sort_orders', []);

        $caseStudy->images()->get()->each(function (CaseStudyImage $image) use ($captions, $sortOrders): void {
            $image->fill([
                'caption' => array_key_exists($image->id, $captions) ? $captions[$image->id] : $image->caption,
                'sort_order' => isset($sortOrders[$image->id]) ? (int) $sortOrders[$image->id] : $image->sort_order,
            ])->save();
        });
    }

    /**
     * Append uploaded gallery images after the existing ones.
     */
    private function storeGalleryImages(CaseStudyRequest $request, CaseStudy $caseStudy): void
    {
        $nextSortOrder = (int) $caseStudy->images()->max('sort_order') + 1;

        foreach ($request->file('gallery_images', []) as $position => $image) {
            $caseStudy->images()->create([
                'path' => $image->store('case-studies/gallery', 'public'),
                'sort_order' => $nextSortOrder + $position,
            ]);
        }
    }

    /**
     * Select options for the case study form.
     *
     * @return array{organizationTypeOptions: mixed, industryOptions: mixed, serviceOptions: mixed, solutionOptions: mixed}
     */
    private function formOptions(): array
    {
        return [
            'organizationTypeOptions' => OrganizationType::options(),
            'industryOptions' => Industry::query()->ordered()->get(['id', 'name'])
                ->map(fn (Industry $industry): array => ['value' => (string) $industry->id, 'label' => $industry->name]),
            'serviceOptions' => Service::query()->ordered()->get(['id', 'name'])
                ->map(fn (Service $service): array => ['value' => (string) $service->id, 'label' => $service->name]),
            'solutionOptions' => Solution::query()->ordered()->get(['id', 'name'])
                ->map(fn (Solution $solution): array => ['value' => (string) $solution->id, 'label' => $solution->name]),
        ];
    }
}
