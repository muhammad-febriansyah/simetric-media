<?php

use App\Enums\LeadActivityType;
use App\Models\ConsultationRequest;
use App\Models\User;

test('adds a follow-up note to the lead timeline', function () {
    $admin = User::factory()->admin()->create();
    $lead = ConsultationRequest::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.leads.notes.store', $lead), ['note' => 'Klien minta proposal minggu depan.'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.leads.show', $lead));

    $activity = $lead->activities()->sole();
    expect($activity->type)->toBe(LeadActivityType::Note)
        ->and($activity->note)->toBe('Klien minta proposal minggu depan.')
        ->and($activity->user_id)->toBe($admin->id);
});

test('rejects an empty note', function () {
    $lead = ConsultationRequest::factory()->create();

    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.leads.notes.store', $lead), ['note' => ''])
        ->assertSessionHasErrors(['note' => 'Catatan wajib diisi.']);

    expect($lead->activities()->count())->toBe(0);
});
