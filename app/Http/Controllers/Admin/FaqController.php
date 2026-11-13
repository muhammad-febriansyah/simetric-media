<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FaqRequest;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Models\Industry;
use App\Models\Service;
use App\Models\Solution;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    /**
     * List all FAQs.
     */
    public function index(): Response
    {
        return Inertia::render('admin/faqs/index', [
            'faqs' => FaqResource::collection(
                Faq::query()->with('faqable')->orderBy('page')->orderBy('faqable_type')->orderBy('faqable_id')->orderBy('sort_order')->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/faqs/form', [
            'faq' => null,
            ...$this->formOptions(),
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(FaqRequest $request): RedirectResponse
    {
        Faq::query()->create([
            ...$request->safe()->only(['question', 'answer']),
            ...$request->placementAttributes(),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'FAQ berhasil ditambahkan.']);

        return to_route('admin.faqs.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(Faq $faq): Response
    {
        return Inertia::render('admin/faqs/form', [
            'faq' => (new FaqResource($faq))->resolve(),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(FaqRequest $request, Faq $faq): RedirectResponse
    {
        $faq->update([
            ...$request->safe()->only(['question', 'answer']),
            ...$request->placementAttributes(),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'FAQ berhasil diperbarui.']);

        return to_route('admin.faqs.index');
    }

    /**
     * Delete a record.
     */
    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'FAQ berhasil dihapus.']);

        return to_route('admin.faqs.index');
    }

    /**
     * Select options for the form.
     *
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'placementGroups' => [
                [
                    'label' => 'Halaman',
                    'options' => collect(Faq::PAGES)->map(fn (string $label, string $page): array => ['value' => 'page:'.$page, 'label' => $label])->values(),
                ],
                [
                    'label' => 'Layanan',
                    'options' => Service::query()->ordered()->get(['id', 'name'])->map(fn (Service $service): array => ['value' => 'service:'.$service->id, 'label' => $service->name]),
                ],
                [
                    'label' => 'Industri',
                    'options' => Industry::query()->ordered()->get(['id', 'name'])->map(fn (Industry $industry): array => ['value' => 'industry:'.$industry->id, 'label' => $industry->name]),
                ],
                [
                    'label' => 'Solusi',
                    'options' => Solution::query()->ordered()->get(['id', 'name'])->map(fn (Solution $solution): array => ['value' => 'solution:'.$solution->id, 'label' => $solution->name]),
                ],
            ],
        ];
    }
}
