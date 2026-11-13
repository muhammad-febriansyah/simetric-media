<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StoresPublicImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Models\CaseStudy;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    use StoresPublicImages;

    /**
     * List all testimonials.
     */
    public function index(): Response
    {
        return Inertia::render('admin/testimonials/index', [
            'testimonials' => TestimonialResource::collection(
                Testimonial::query()->with('caseStudy')->orderBy('sort_order')->latest()->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/testimonials/form', [
            'testimonial' => null,
            ...$this->formOptions(),
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(TestimonialRequest $request): RedirectResponse
    {
        Testimonial::query()->create([
            ...$request->safe()->except(['photo', 'remove_photo']),
            'photo' => $request->file('photo')?->store('testimonials', 'public'),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Testimoni berhasil ditambahkan.']);

        return to_route('admin.testimonials.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(Testimonial $testimonial): Response
    {
        $testimonial->load('caseStudy');

        return Inertia::render('admin/testimonials/form', [
            'testimonial' => (new TestimonialResource($testimonial))->resolve(),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(TestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        [$photo, $previousPhoto] = $this->resolveImage($request, 'photo', $testimonial->photo, 'testimonials', 'remove_photo');

        $testimonial->update([
            ...$request->safe()->except(['photo', 'remove_photo']),
            'photo' => $photo,
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        $this->deletePublicFiles($previousPhoto);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Testimoni berhasil diperbarui.']);

        return to_route('admin.testimonials.index');
    }

    /**
     * Delete a record.
     */
    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        $this->deletePublicFiles($testimonial->photo);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Testimoni berhasil dihapus.']);

        return to_route('admin.testimonials.index');
    }

    /**
     * Select options for the form.
     *
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'caseStudyOptions' => CaseStudy::query()->ordered()->get(['id', 'title'])
                ->map(fn (CaseStudy $caseStudy): array => ['value' => (string) $caseStudy->id, 'label' => $caseStudy->title]),
        ];
    }
}
