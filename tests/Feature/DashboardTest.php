<?php

use App\Enums\BusinessFunction;
use App\Enums\LeadStatus;
use App\Models\CaseStudy;
use App\Models\ConsultationRequest;
use App\Models\Industry;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('users without admin access are forbidden from the dashboard', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('dashboard'))->assertForbidden();
});

test('admins see lead KPIs, trends and breakdowns on the dashboard', function () {
    $this->travelTo(now()->setDate(2026, 5, 15));
    $this->actingAs(User::factory()->admin()->create());

    $industry = Industry::factory()->create(['name' => 'Manufaktur']);
    ConsultationRequest::factory()->count(2)->create([
        'status' => LeadStatus::New,
        'problem_area' => BusinessFunction::Sales,
        'industry_id' => $industry->id,
    ]);
    ConsultationRequest::factory()->create(['status' => LeadStatus::Proposal, 'problem_area' => BusinessFunction::Sales]);
    ConsultationRequest::factory()->create(['status' => LeadStatus::Won, 'problem_area' => BusinessFunction::Finance]);
    ConsultationRequest::factory()->create(['status' => LeadStatus::Lost, 'created_at' => now()->subMonth()]);
    CaseStudy::factory()->create();
    CaseStudy::factory()->draft()->create();

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('kpis.leadsThisMonth.value', 4)
            ->where('kpis.leadsThisMonth.previous', 1)
            ->where('kpis.activeLeads.value', 3)
            ->where('kpis.conversionRate.value', 50)
            ->where('kpis.unassignedLeads.value', 3)
            ->has('trend.monthly', 6)
            ->where('trend.monthly.5.total', 4)
            ->where('trend.monthly.4.total', 1)
            ->has('trend.daily', 30)
            ->where('leadsByProblemArea.0.label', BusinessFunction::Sales->label())
            ->where('leadsByProblemArea.0.total', 3)
            ->where('leadsByIndustry.0.label', 'Tidak disebutkan')
            ->where('leadsByIndustry.0.total', 3)
            ->where('leadsByIndustry.1.label', 'Manufaktur')
            ->where('leadsByIndustry.1.total', 2)
            ->where('content.0.label', 'Studi kasus')
            ->where('content.0.published', 1)
            ->where('content.0.draft', 1)
            ->has('needsAttention', 2)
            ->has('latestLeads', 5)
        );
});

test('groups industries beyond the top five into Lainnya', function () {
    $this->actingAs(User::factory()->admin()->create());

    Industry::factory()->count(6)->create()->each(
        fn (Industry $industry) => ConsultationRequest::factory()->create(['industry_id' => $industry->id]),
    );

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('leadsByIndustry', 6)
            ->where('leadsByIndustry.5.label', 'Lainnya')
            ->where('leadsByIndustry.5.total', 1)
        );
});
