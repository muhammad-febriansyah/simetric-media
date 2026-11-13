<?php

use App\Models\CaseStudy;
use App\Models\Product;
use App\Models\Testimonial;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
});

test('creates a testimonial linked to a case study', function () {
    $caseStudy = CaseStudy::factory()->create();

    $this->post(route('admin.testimonials.store'), [
        'author_name' => 'Budi Santoso',
        'company' => 'PT Maju Jaya',
        'quote' => 'Tim memahami bisnis kami.',
        'case_study_id' => $caseStudy->id,
        'is_active' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.testimonials.index'));

    expect(Testimonial::query()->sole()->case_study_id)->toBe($caseStudy->id);
});

test('links a testimonial to a product', function () {
    $product = Product::factory()->create();

    $this->post(route('admin.testimonials.store'), [
        'author_name' => 'Sari Wijaya',
        'quote' => 'Balasan ke pelanggan jadi instan.',
        'product_id' => $product->id,
    ])->assertSessionHasNoErrors();

    expect(Testimonial::query()->sole()->product_id)->toBe($product->id);
});

test('rejects an unknown product', function () {
    $this->post(route('admin.testimonials.store'), [
        'author_name' => 'Sari Wijaya',
        'quote' => 'Balasan ke pelanggan jadi instan.',
        'product_id' => 999,
    ])->assertSessionHasErrors('product_id');
});

test('requires the author name and quote', function () {
    $this->post(route('admin.testimonials.store'), [])
        ->assertSessionHasErrors([
            'author_name' => 'Nama pemberi testimoni wajib diisi.',
            'quote' => 'Testimoni wajib diisi.',
        ]);
});

test('deletes a testimonial', function () {
    $testimonial = Testimonial::factory()->create();

    $this->delete(route('admin.testimonials.destroy', $testimonial))
        ->assertRedirect(route('admin.testimonials.index'));

    $this->assertModelMissing($testimonial);
});
