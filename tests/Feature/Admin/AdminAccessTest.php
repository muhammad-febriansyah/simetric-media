<?php

use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('only admins pass the access-admin gate', function () {
    expect(Gate::forUser(User::factory()->admin()->create())->allows('access-admin'))->toBeTrue()
        ->and(Gate::forUser(User::factory()->create())->allows('access-admin'))->toBeFalse();
});

test('admin pages forbid users without admin access', function (string $routeName) {
    $this->actingAs(User::factory()->create());

    $this->get(route($routeName))->assertForbidden();
})->with([
    'admin.leads.index',
    'admin.case-studies.index',
    'admin.services.index',
    'admin.industries.index',
    'admin.articles.index',
    'admin.client-logos.index',
    'admin.milestones.index',
    'admin.offices.index',
    'admin.solutions.index',
    'admin.faqs.index',
    'admin.team-members.index',
    'admin.testimonials.index',
    'admin.users.index',
    'admin.site-settings.edit',
    'admin.trash.index',
]);

test('admin pages redirect guests to the login page', function () {
    $this->get(route('admin.leads.index'))->assertRedirect(route('login'));
});

test('public registration is disabled', function () {
    $this->get('/register')->assertNotFound();
});
