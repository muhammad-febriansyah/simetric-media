<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StoresPublicImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClientLogoRequest;
use App\Http\Resources\ClientLogoResource;
use App\Models\ClientLogo;
use App\Models\Industry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClientLogoController extends Controller
{
    use StoresPublicImages;

    /**
     * List all client logos.
     */
    public function index(): Response
    {
        return Inertia::render('admin/client-logos/index', [
            'clientLogos' => ClientLogoResource::collection(
                ClientLogo::query()->with('industry')->orderBy('sort_order')->orderBy('name')->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/client-logos/form', [
            'clientLogo' => null,
            ...$this->formOptions(),
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(ClientLogoRequest $request): RedirectResponse
    {
        ClientLogo::query()->create([
            ...$request->safe()->except('logo'),
            'logo' => $request->file('logo')->store('client-logos', 'public'),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logo klien berhasil ditambahkan.']);

        return to_route('admin.client-logos.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(ClientLogo $clientLogo): Response
    {
        $clientLogo->load('industry');

        return Inertia::render('admin/client-logos/form', [
            'clientLogo' => (new ClientLogoResource($clientLogo))->resolve(),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(ClientLogoRequest $request, ClientLogo $clientLogo): RedirectResponse
    {
        [$logo, $previousLogo] = $this->resolveImage($request, 'logo', $clientLogo->logo, 'client-logos');

        $clientLogo->update([
            ...$request->safe()->except('logo'),
            'logo' => $logo,
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        $this->deletePublicFiles($previousLogo);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logo klien berhasil diperbarui.']);

        return to_route('admin.client-logos.index');
    }

    /**
     * Delete a record.
     */
    public function destroy(ClientLogo $clientLogo): RedirectResponse
    {
        $clientLogo->delete();

        $this->deletePublicFiles($clientLogo->logo);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logo klien berhasil dihapus.']);

        return to_route('admin.client-logos.index');
    }

    /**
     * Select options for the client logo form.
     *
     * @return array{industryOptions: mixed}
     */
    private function formOptions(): array
    {
        return [
            'industryOptions' => Industry::query()->ordered()->get(['id', 'name'])
                ->map(fn (Industry $industry): array => ['value' => (string) $industry->id, 'label' => $industry->name]),
        ];
    }
}
