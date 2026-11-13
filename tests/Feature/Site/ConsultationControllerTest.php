<?php

use App\Enums\LeadActivityType;
use App\Enums\LeadStatus;
use App\Models\ConsultationRequest;
use App\Models\User;
use App\Notifications\NewConsultationRequestNotification;
use Illuminate\Support\Facades\Notification;

/**
 * @return array<string, mixed>
 */
function validConsultationPayload(array $overrides = []): array
{
    return [
        'name' => 'Budi Santoso',
        'email' => 'budi@perusahaan.co.id',
        'phone' => '081234567890',
        'company_name' => 'PT Maju Jaya',
        'problem_area' => 'operations',
        'problem_description' => 'Stok gudang sering tidak sinkron dengan data penjualan.',
        ...$overrides,
    ];
}

test('stores a new lead and notifies every admin', function () {
    Notification::fake();
    $admins = User::factory()->admin()->count(2)->create();
    $nonAdmin = User::factory()->create();

    $this->post(route('consultation.store'), validConsultationPayload())
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('consultation.thanks'));

    $lead = ConsultationRequest::query()->sole();

    expect($lead->status)->toBe(LeadStatus::New)
        ->and($lead->activities()->sole()->type)->toBe(LeadActivityType::Created);

    Notification::assertSentTo($admins, NewConsultationRequestNotification::class,
        fn (NewConsultationRequestNotification $notification) => $notification->consultationRequest->is($lead));
    Notification::assertNotSentTo($nonAdmin, NewConsultationRequestNotification::class);
});

test('emails the new lead to admins with a link to the lead', function () {
    Notification::fake();
    $admin = User::factory()->admin()->create();

    $this->post(route('consultation.store'), validConsultationPayload())->assertRedirect();

    $lead = ConsultationRequest::query()->sole();

    Notification::assertSentTo($admin, NewConsultationRequestNotification::class, function (NewConsultationRequestNotification $notification) use ($admin, $lead): bool {
        $mail = $notification->toMail($admin);

        return in_array('mail', $notification->via($admin), true)
            && $mail->subject === 'Lead baru: Budi Santoso (PT Maju Jaya)'
            && $mail->actionUrl === route('admin.leads.show', $lead);
    });
});

test('requires the contact, company and problem fields', function () {
    $this->post(route('consultation.store'), [])
        ->assertSessionHasErrors([
            'name' => 'Nama lengkap wajib diisi.',
            'email' => 'Email kerja wajib diisi.',
            'phone' => 'Nomor WhatsApp wajib diisi.',
            'company_name' => 'Nama perusahaan wajib diisi.',
            'problem_area' => 'Area masalah wajib diisi.',
            'problem_description' => 'Deskripsi masalah wajib diisi.',
        ]);

    expect(ConsultationRequest::query()->count())->toBe(0);
});

test('rejects submissions that fill the honeypot field', function () {
    $this->post(route('consultation.store'), validConsultationPayload(['website' => 'https://spam.example']))
        ->assertSessionHasErrors('website');

    expect(ConsultationRequest::query()->count())->toBe(0);
});

test('limits consultation submissions to five per minute', function () {
    foreach (range(1, 5) as $attempt) {
        $this->post(route('consultation.store'), validConsultationPayload())->assertRedirect();
    }

    $this->post(route('consultation.store'), validConsultationPayload())->assertTooManyRequests();
});
