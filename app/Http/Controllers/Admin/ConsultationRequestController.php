<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LeadActivityType;
use App\Enums\LeadStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateLeadRequest;
use App\Http\Resources\LeadActivityResource;
use App\Http\Resources\LeadResource;
use App\Models\ConsultationRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ConsultationRequestController extends Controller
{
    /**
     * List consultation leads with search, status filter and pagination.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(LeadStatus::class)],
            'per_page' => ['nullable', 'integer', Rule::in([10, 20, 50])],
        ]);

        $leads = ConsultationRequest::query()
            ->with(['industry', 'assignee'])
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->whereLike('name', "%{$search}%")
                        ->orWhereLike('company_name', "%{$search}%")
                        ->orWhereLike('email', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();

        return Inertia::render('admin/leads/index', [
            'leads' => [
                'data' => LeadResource::collection($leads->items())->resolve(),
                'meta' => [
                    'current_page' => $leads->currentPage(),
                    'last_page' => $leads->lastPage(),
                    'per_page' => $leads->perPage(),
                    'total' => $leads->total(),
                    'from' => $leads->firstItem(),
                    'to' => $leads->lastItem(),
                ],
            ],
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
            ],
            'statusOptions' => LeadStatus::options(),
        ]);
    }

    /**
     * Show a lead with its activity timeline.
     */
    public function show(ConsultationRequest $consultationRequest): Response
    {
        $consultationRequest->load(['industry', 'assignee']);

        return Inertia::render('admin/leads/show', [
            'lead' => (new LeadResource($consultationRequest))->resolve(),
            'activities' => LeadActivityResource::collection(
                $consultationRequest->activities()->with('user')->latest()->latest('id')->get(),
            )->resolve(),
            'statusOptions' => LeadStatus::options(),
            'assigneeOptions' => User::query()
                ->where('is_admin', true)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (User $user): array => ['value' => (string) $user->id, 'label' => $user->name]),
        ]);
    }

    /**
     * Update the lead status and PIC, recording each change in the timeline.
     */
    public function update(UpdateLeadRequest $request, ConsultationRequest $consultationRequest): RedirectResponse
    {
        $newStatus = LeadStatus::from($request->validated('status'));
        $newAssigneeId = $request->validated('assigned_to');
        $previousStatus = $consultationRequest->status;
        $user = $request->user();

        DB::transaction(function () use ($consultationRequest, $newStatus, $newAssigneeId, $previousStatus, $user): void {
            $consultationRequest->update([
                'status' => $newStatus,
                'assigned_to' => $newAssigneeId,
            ]);

            if ($previousStatus !== $newStatus) {
                $consultationRequest->recordActivity(LeadActivityType::StatusChanged, $user, [
                    'from_status' => $previousStatus,
                    'to_status' => $newStatus,
                ]);
            }

            if ($consultationRequest->wasChanged('assigned_to')) {
                $consultationRequest->recordActivity(LeadActivityType::Assigned, $user, [
                    'note' => $consultationRequest->assignee()->value('name') ?? 'Tanpa PIC',
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lead berhasil diperbarui.']);

        return to_route('admin.leads.show', $consultationRequest);
    }

    /**
     * Soft delete a lead.
     */
    public function destroy(ConsultationRequest $consultationRequest): RedirectResponse
    {
        $consultationRequest->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lead berhasil dihapus.']);

        return to_route('admin.leads.index');
    }
}
