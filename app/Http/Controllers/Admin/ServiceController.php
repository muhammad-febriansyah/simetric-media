<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Expertise;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * List all services.
     */
    public function index(): Response
    {
        return Inertia::render('admin/services/index', [
            'services' => ServiceResource::collection(
                Service::query()->with('expertise')->withCount('caseStudies')->ordered()->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the form for creating a service.
     */
    public function create(): Response
    {
        return Inertia::render('admin/services/form', [
            'service' => null,
            'expertiseOptions' => $this->expertiseOptions(),
        ]);
    }

    /**
     * Store a new service.
     */
    public function store(ServiceRequest $request): RedirectResponse
    {
        Service::query()->create([
            ...$request->safe()->except('is_published'),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Layanan berhasil ditambahkan.']);

        return to_route('admin.services.index');
    }

    /**
     * Show the form for editing a service.
     */
    public function edit(Service $service): Response
    {
        return Inertia::render('admin/services/form', [
            'service' => (new ServiceResource($service))->resolve(),
            'expertiseOptions' => $this->expertiseOptions(),
        ]);
    }

    /**
     * Update a service.
     */
    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update([
            ...$request->safe()->except('is_published'),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt($service->published_at),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Layanan berhasil diperbarui.']);

        return to_route('admin.services.index');
    }

    /**
     * Delete a service.
     */
    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Layanan berhasil dihapus.']);

        return to_route('admin.services.index');
    }

    /**
     * Expertise options for the service form.
     *
     * @return list<array{value: string, label: string}>
     */
    private function expertiseOptions(): array
    {
        return Expertise::query()->ordered()->get(['id', 'name'])
            ->map(fn (Expertise $expertise): array => ['value' => (string) $expertise->id, 'label' => $expertise->name])
            ->all();
    }
}
