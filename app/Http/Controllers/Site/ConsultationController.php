<?php

namespace App\Http\Controllers\Site;

use App\Enums\BudgetRange;
use App\Enums\BusinessFunction;
use App\Enums\CompanySize;
use App\Enums\LeadActivityType;
use App\Enums\ProjectTimeline;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConsultationRequest;
use App\Models\ConsultationRequest;
use App\Models\Industry;
use App\Models\User;
use App\Notifications\NewConsultationRequestNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class ConsultationController extends Controller
{
    /**
     * Show the multi-step consultation form.
     */
    public function create(): Response
    {
        return Inertia::render('site/consultation/create', [
            'industryOptions' => Industry::query()->published()->ordered()->get(['id', 'name'])
                ->map(fn (Industry $industry): array => ['value' => (string) $industry->id, 'label' => $industry->name]),
            'companySizeOptions' => CompanySize::options(),
            'problemAreaOptions' => BusinessFunction::options(),
            'timelineOptions' => ProjectTimeline::options(),
            'budgetOptions' => BudgetRange::options(),
        ]);
    }

    /**
     * Store a consultation request as a new lead.
     */
    public function store(StoreConsultationRequest $request): RedirectResponse
    {
        $lead = DB::transaction(function () use ($request): ConsultationRequest {
            $lead = ConsultationRequest::query()->create(
                collect($request->validated())->except('website')->all(),
            );

            $lead->recordActivity(LeadActivityType::Created);

            return $lead;
        });

        Notification::send(
            User::query()->where('is_admin', true)->get(),
            new NewConsultationRequestNotification($lead),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Permintaan konsultasi berhasil dikirim.']);

        return to_route('consultation.thanks');
    }

    /**
     * Show the thank-you page with the next steps.
     */
    public function thanks(): Response
    {
        return Inertia::render('site/consultation/thanks');
    }
}
