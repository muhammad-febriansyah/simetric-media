<?php

use App\Enums\LeadActivityType;
use App\Enums\LeadStatus;
use App\Models\ConsultationRequest;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
    $this->actingAs($this->admin);
});

describe('index', function () {
    test('searches leads by name, company or email', function () {
        ConsultationRequest::factory()->create(['company_name' => 'PT Maju Jaya']);
        ConsultationRequest::factory()->create(['company_name' => 'CV Lain']);

        $this->get(route('admin.leads.index', ['search' => 'maju']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/leads/index')
                ->has('leads.data', 1)
                ->where('leads.data.0.company_name', 'PT Maju Jaya')
            );
    });

    test('filters leads by status', function () {
        ConsultationRequest::factory()->create(['status' => LeadStatus::Proposal]);
        ConsultationRequest::factory()->count(2)->create(['status' => LeadStatus::New]);

        $this->get(route('admin.leads.index', ['status' => 'proposal']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('leads.data', 1)
                ->where('leads.data.0.status.value', 'proposal')
                ->where('filters.status', 'proposal')
            );
    });

    test('paginates leads with the requested page size', function () {
        ConsultationRequest::factory()->count(12)->create();

        $this->get(route('admin.leads.index', ['page' => 2]))
            ->assertInertia(fn (Assert $page) => $page
                ->has('leads.data', 2)
                ->where('leads.meta.total', 12)
                ->where('leads.meta.current_page', 2)
                ->where('leads.meta.per_page', 10)
            );
    });

    test('rejects an unknown status filter', function () {
        $this->get(route('admin.leads.index', ['status' => 'unknown']))
            ->assertSessionHasErrors('status');
    });
});

describe('show', function () {
    test('renders the lead with its activity timeline', function () {
        $lead = ConsultationRequest::factory()->create();
        $lead->recordActivity(LeadActivityType::Created);

        $this->get(route('admin.leads.show', $lead))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/leads/show')
                ->where('lead.id', $lead->id)
                ->has('activities', 1)
                ->where('activities.0.type.value', 'created')
            );
    });
});

describe('update', function () {
    test('records a timeline entry when the status changes', function () {
        $lead = ConsultationRequest::factory()->create(['status' => LeadStatus::New]);

        $this->put(route('admin.leads.update', $lead), ['status' => 'discovery_call'])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.leads.show', $lead));

        expect($lead->refresh()->status)->toBe(LeadStatus::DiscoveryCall);

        $activity = $lead->activities()->sole();
        expect($activity->type)->toBe(LeadActivityType::StatusChanged)
            ->and($activity->from_status)->toBe(LeadStatus::New)
            ->and($activity->to_status)->toBe(LeadStatus::DiscoveryCall)
            ->and($activity->user_id)->toBe($this->admin->id);
    });

    test('records a timeline entry when the PIC changes', function () {
        $lead = ConsultationRequest::factory()->create(['status' => LeadStatus::New]);
        $assignee = User::factory()->admin()->create(['name' => 'Rina']);

        $this->put(route('admin.leads.update', $lead), [
            'status' => 'new',
            'assigned_to' => $assignee->id,
        ])->assertSessionHasNoErrors();

        expect($lead->refresh()->assigned_to)->toBe($assignee->id);

        $activity = $lead->activities()->sole();
        expect($activity->type)->toBe(LeadActivityType::Assigned)
            ->and($activity->note)->toBe('Rina');
    });

    test('does not record activity when nothing changes', function () {
        $lead = ConsultationRequest::factory()->create(['status' => LeadStatus::New]);

        $this->put(route('admin.leads.update', $lead), ['status' => 'new'])
            ->assertSessionHasNoErrors();

        expect($lead->activities()->count())->toBe(0);
    });

    test('rejects a PIC who is not an admin', function () {
        $lead = ConsultationRequest::factory()->create();

        $this->put(route('admin.leads.update', $lead), [
            'status' => 'new',
            'assigned_to' => User::factory()->create()->id,
        ])->assertSessionHasErrors(['assigned_to' => 'PIC yang dipilih tidak valid.']);

        expect($lead->refresh()->assigned_to)->toBeNull();
    });

    test('rejects an unknown status', function () {
        $lead = ConsultationRequest::factory()->create();

        $this->put(route('admin.leads.update', $lead), ['status' => 'archived'])
            ->assertSessionHasErrors(['status' => 'Pilihan Status tidak valid.']);
    });
});

describe('destroy', function () {
    test('soft deletes the lead', function () {
        $lead = ConsultationRequest::factory()->create();

        $this->delete(route('admin.leads.destroy', $lead))
            ->assertRedirect(route('admin.leads.index'));

        $this->assertSoftDeleted($lead);
    });
});
