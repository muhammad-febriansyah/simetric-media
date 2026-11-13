<?php

use App\Models\ConsultationRequest;
use App\Models\User;
use App\Notifications\NewConsultationRequestNotification;
use Inertia\Testing\AssertableInertia as Assert;

test('opening a notification marks it as read and shows the lead', function () {
    $admin = User::factory()->admin()->create();
    $lead = ConsultationRequest::factory()->create();
    $admin->notify(new NewConsultationRequestNotification($lead));
    $notification = $admin->notifications()->sole();

    $this->actingAs($admin)
        ->post(route('admin.notifications.read', $notification->id))
        ->assertRedirect(route('admin.leads.show', $lead));

    expect($notification->refresh()->read_at)->not->toBeNull();
});

test('returns 404 for a notification that belongs to another admin', function () {
    $owner = User::factory()->admin()->create();
    $owner->notify(new NewConsultationRequestNotification(ConsultationRequest::factory()->create()));
    $notification = $owner->notifications()->sole();

    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.notifications.read', $notification->id))
        ->assertNotFound();

    expect($notification->refresh()->read_at)->toBeNull();
});

test('marks all notifications of the admin as read', function () {
    $admin = User::factory()->admin()->create();
    $otherAdmin = User::factory()->admin()->create();
    $lead = ConsultationRequest::factory()->create();
    $admin->notify(new NewConsultationRequestNotification($lead));
    $admin->notify(new NewConsultationRequestNotification($lead));
    $otherAdmin->notify(new NewConsultationRequestNotification($lead));

    $this->actingAs($admin)
        ->from(route('dashboard'))
        ->post(route('admin.notifications.read-all'))
        ->assertRedirect(route('dashboard'));

    expect($admin->unreadNotifications()->count())->toBe(0)
        ->and($otherAdmin->unreadNotifications()->count())->toBe(1);
});

test('shares the unread count and new lead count with admins', function () {
    $admin = User::factory()->admin()->create();
    $lead = ConsultationRequest::factory()->create();
    $admin->notify(new NewConsultationRequestNotification($lead));

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('admin.notifications.unreadCount', 1)
            ->where('admin.notifications.items.0.data.name', $lead->name)
            ->where('admin.newLeadsCount', 1)
        );
});

test('does not share admin data with other users', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page->where('admin', null));
});
