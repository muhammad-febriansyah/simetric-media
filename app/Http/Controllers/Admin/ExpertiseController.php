<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExpertiseRequest;
use App\Http\Resources\ExpertiseResource;
use App\Models\Expertise;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExpertiseController extends Controller
{
    /**
     * List all areas of expertise.
     */
    public function index(): Response
    {
        return Inertia::render('admin/expertises/index', [
            'expertises' => ExpertiseResource::collection(
                Expertise::query()->withCount('services')->ordered()->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/expertises/form', [
            'expertise' => null,
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(ExpertiseRequest $request): RedirectResponse
    {
        Expertise::query()->create([
            ...$request->safe()->except('is_published'),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Bidang keahlian berhasil ditambahkan.']);

        return to_route('admin.expertises.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(Expertise $expertise): Response
    {
        return Inertia::render('admin/expertises/form', [
            'expertise' => (new ExpertiseResource($expertise))->resolve(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(ExpertiseRequest $request, Expertise $expertise): RedirectResponse
    {
        $expertise->update([
            ...$request->safe()->except('is_published'),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt($expertise->published_at),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Bidang keahlian berhasil diperbarui.']);

        return to_route('admin.expertises.index');
    }

    /**
     * Delete a record. Areas that still group services cannot be deleted.
     */
    public function destroy(Expertise $expertise): RedirectResponse
    {
        $servicesCount = $expertise->services()->count();

        if ($servicesCount > 0) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => "Pindahkan dulu {$servicesCount} layanan di bidang ini ke bidang lain sebelum menghapus.",
            ]);

            return to_route('admin.expertises.index');
        }

        $expertise->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Bidang keahlian berhasil dihapus.']);

        return to_route('admin.expertises.index');
    }
}
