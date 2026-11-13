<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CompanyMilestoneRequest;
use App\Http\Resources\CompanyMilestoneResource;
use App\Models\CompanyMilestone;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyMilestoneController extends Controller
{
    /**
     * List all company history milestones.
     */
    public function index(): Response
    {
        return Inertia::render('admin/milestones/index', [
            'milestones' => CompanyMilestoneResource::collection(
                CompanyMilestone::query()->orderBy('year')->orderBy('sort_order')->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/milestones/form', [
            'companyMilestone' => null,
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(CompanyMilestoneRequest $request): RedirectResponse
    {
        CompanyMilestone::query()->create([
            ...$request->validated(),
            'sort_order' => $request->integer('sort_order'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Milestone berhasil ditambahkan.']);

        return to_route('admin.milestones.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(CompanyMilestone $companyMilestone): Response
    {
        return Inertia::render('admin/milestones/form', [
            'companyMilestone' => (new CompanyMilestoneResource($companyMilestone))->resolve(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(CompanyMilestoneRequest $request, CompanyMilestone $companyMilestone): RedirectResponse
    {
        $companyMilestone->update([
            ...$request->validated(),
            'sort_order' => $request->integer('sort_order'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Milestone berhasil diperbarui.']);

        return to_route('admin.milestones.index');
    }

    /**
     * Delete a record.
     */
    public function destroy(CompanyMilestone $companyMilestone): RedirectResponse
    {
        $companyMilestone->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Milestone berhasil dihapus.']);

        return to_route('admin.milestones.index');
    }
}
