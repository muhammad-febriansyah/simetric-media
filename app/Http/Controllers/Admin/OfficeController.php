<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OfficeRequest;
use App\Http\Resources\OfficeResource;
use App\Models\Office;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OfficeController extends Controller
{
    /**
     * List all offices.
     */
    public function index(): Response
    {
        return Inertia::render('admin/offices/index', [
            'offices' => OfficeResource::collection(
                Office::query()->orderBy('type')->orderBy('sort_order')->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/offices/form', [
            'office' => null,
            ...$this->formOptions(),
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(OfficeRequest $request): RedirectResponse
    {
        Office::query()->create([
            ...$request->validated(),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kantor berhasil ditambahkan.']);

        return to_route('admin.offices.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(Office $office): Response
    {
        return Inertia::render('admin/offices/form', [
            'office' => (new OfficeResource($office))->resolve(),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(OfficeRequest $request, Office $office): RedirectResponse
    {
        $office->update([
            ...$request->validated(),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kantor berhasil diperbarui.']);

        return to_route('admin.offices.index');
    }

    /**
     * Delete a record.
     */
    public function destroy(Office $office): RedirectResponse
    {
        $office->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kantor berhasil dihapus.']);

        return to_route('admin.offices.index');
    }

    /**
     * Select options for the office form.
     *
     * @return array{typeOptions: mixed}
     */
    private function formOptions(): array
    {
        return [
            'typeOptions' => OfficeType::options(),
        ];
    }
}
