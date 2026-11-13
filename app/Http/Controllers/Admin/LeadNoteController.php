<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LeadActivityType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLeadNoteRequest;
use App\Models\ConsultationRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class LeadNoteController extends Controller
{
    /**
     * Add a follow-up note to a lead's timeline.
     */
    public function store(StoreLeadNoteRequest $request, ConsultationRequest $consultationRequest): RedirectResponse
    {
        $consultationRequest->recordActivity(LeadActivityType::Note, $request->user(), [
            'note' => $request->validated('note'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Catatan berhasil ditambahkan.']);

        return to_route('admin.leads.show', $consultationRequest);
    }
}
