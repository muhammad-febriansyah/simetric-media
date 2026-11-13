<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessFunction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SolutionRequest;
use App\Http\Resources\SolutionResource;
use App\Models\Solution;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SolutionController extends Controller
{
    /**
     * List all solutions.
     */
    public function index(): Response
    {
        return Inertia::render('admin/solutions/index', [
            'solutions' => SolutionResource::collection(
                Solution::query()->withCount('caseStudies')->ordered()->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/solutions/form', [
            'solution' => null,
            ...$this->formOptions(),
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(SolutionRequest $request): RedirectResponse
    {
        Solution::query()->create([
            ...$request->safe()->except('is_published'),
            'features' => $request->validated('features', []),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Solusi berhasil ditambahkan.']);

        return to_route('admin.solutions.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(Solution $solution): Response
    {
        return Inertia::render('admin/solutions/form', [
            'solution' => (new SolutionResource($solution))->resolve(),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(SolutionRequest $request, Solution $solution): RedirectResponse
    {
        $solution->update([
            ...$request->safe()->except('is_published'),
            'features' => $request->validated('features', []),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt($solution->published_at),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Solusi berhasil diperbarui.']);

        return to_route('admin.solutions.index');
    }

    /**
     * Delete a record.
     */
    public function destroy(Solution $solution): RedirectResponse
    {
        $solution->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Solusi berhasil dihapus.']);

        return to_route('admin.solutions.index');
    }

    /**
     * Select options for the form.
     *
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'businessFunctionOptions' => BusinessFunction::options(),
        ];
    }
}
