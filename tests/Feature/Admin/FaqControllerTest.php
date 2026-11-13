<?php

use App\Models\Faq;
use App\Models\Service;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
});

test('creates a FAQ for a static page', function () {
    $this->post(route('admin.faqs.store'), [
        'placement' => 'page:how-we-work',
        'question' => 'Apakah konsultasi gratis?',
        'answer' => 'Ya.',
        'is_active' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.faqs.index'));

    $faq = Faq::query()->sole();

    expect($faq->page)->toBe('how-we-work')
        ->and($faq->faqable_type)->toBeNull();
});

test('creates a FAQ attached to a service', function () {
    $service = Service::factory()->create();

    $this->post(route('admin.faqs.store'), [
        'placement' => 'service:'.$service->id,
        'question' => 'Berapa lama?',
        'answer' => '2 minggu.',
    ])->assertSessionHasNoErrors();

    $faq = Faq::query()->sole();

    expect($faq->page)->toBeNull()
        ->and($faq->faqable->is($service))->toBeTrue()
        ->and($faq->placementLabel())->toBe('Layanan: '.$service->name);
});

test('rejects a placement that does not exist', function (string $placement) {
    $this->post(route('admin.faqs.store'), [
        'placement' => $placement,
        'question' => 'Pertanyaan?',
        'answer' => 'Jawaban.',
    ])->assertSessionHasErrors(['placement' => 'Lokasi FAQ yang dipilih tidak valid.']);
})->with([
    'unknown page' => 'page:pricing',
    'missing service' => 'service:999',
    'unsupported type' => 'user:1',
]);

test('shows the placement options grouped by type', function () {
    Service::factory()->create();

    $this->get(route('admin.faqs.create'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/faqs/form')
            ->where('placementGroups.0.label', 'Halaman')
            ->has('placementGroups.1.options', 1)
        );
});

test('sanitizes the FAQ answer from the rich text editor', function () {
    $this->post(route('admin.faqs.store'), [
        'placement' => 'page:how-we-work',
        'question' => 'Apakah aman?',
        'answer' => '<p>Ya, <strong>aman</strong>.</p><img src="x" onerror="alert(1)">',
    ])->assertSessionHasNoErrors();

    expect(Faq::query()->sole()->answer)->toBe('<p>Ya, <strong>aman</strong>.</p>');
});
