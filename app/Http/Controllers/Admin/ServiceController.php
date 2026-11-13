<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ServicePillar;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Resources\ServiceResource;
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
                Service::query()->withCount('caseStudies')->ordered()->get(),
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
            'pillarOptions' => ServicePillar::options(),
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
            'pillarOptions' => ServicePillar::options(),
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
}
