<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IndustryRequest;
use App\Http\Resources\IndustryResource;
use App\Models\Industry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IndustryController extends Controller
{
    /**
     * List all industries.
     */
    public function index(): Response
    {
        return Inertia::render('admin/industries/index', [
            'industries' => IndustryResource::collection(
                Industry::query()->withCount('caseStudies')->ordered()->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the form for creating an industry.
     */
    public function create(): Response
    {
        return Inertia::render('admin/industries/form', [
            'industry' => null,
        ]);
    }

    /**
     * Store a new industry.
     */
    public function store(IndustryRequest $request): RedirectResponse
    {
        Industry::query()->create([
            ...$request->safe()->except('is_published'),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Industri berhasil ditambahkan.']);

        return to_route('admin.industries.index');
    }

    /**
     * Show the form for editing an industry.
     */
    public function edit(Industry $industry): Response
    {
        return Inertia::render('admin/industries/form', [
            'industry' => (new IndustryResource($industry))->resolve(),
        ]);
    }

    /**
     * Update an industry.
     */
    public function update(IndustryRequest $request, Industry $industry): RedirectResponse
    {
        $industry->update([
            ...$request->safe()->except('is_published'),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt($industry->published_at),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Industri berhasil diperbarui.']);

        return to_route('admin.industries.index');
    }

    /**
     * Delete an industry. Related case studies and leads keep their data without an industry.
     */
    public function destroy(Industry $industry): RedirectResponse
    {
        $industry->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Industri berhasil dihapus.']);

        return to_route('admin.industries.index');
    }
}
