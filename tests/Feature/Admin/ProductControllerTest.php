<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
    Storage::fake('public');
});

test('lists products in sort order', function () {
    $second = Product::factory()->create(['sort_order' => 2]);
    $first = Product::factory()->draft()->create(['sort_order' => 1]);

    $this->get(route('admin.products.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->where('products.0.id', $first->id)
            ->where('products.0.is_published', false)
            ->where('products.1.id', $second->id)
        );
});

test('creates a product with images, features and highlights', function () {
    $this->post(route('admin.products.store'), [
        'name' => 'ChatCepat',
        'category' => 'Omnichannel & AI',
        'website_url' => 'https://www.chatcepat.id',
        'logo' => UploadedFile::fake()->image('logo.png'),
        'cover_image' => UploadedFile::fake()->image('cover.jpg', 1440, 810),
        'features' => [
            ['title' => 'Inbox omnichannel', 'description' => 'Semua chat dalam satu layar.'],
            ['title' => '', 'description' => ''],
        ],
        'highlights' => [['label' => 'Bisnis pengguna', 'value' => '500+']],
        'is_featured' => '1',
        'is_published' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.products.index'));

    $product = Product::query()->sole();

    expect($product->slug)->toBe('chatcepat')
        ->and($product->features)->toHaveCount(1)
        ->and($product->highlights)->toBe([['label' => 'Bisnis pengguna', 'value' => '500+']])
        ->and($product->is_featured)->toBeTrue()
        ->and($product->isPublished())->toBeTrue();
    Storage::disk('public')->assertExists([$product->logo, $product->cover_image]);
});

test('validates the product form', function () {
    Product::factory()->create(['slug' => 'chatcepat']);

    $this->post(route('admin.products.store'), [
        'slug' => 'chatcepat',
        'website_url' => 'bukan-url',
        'cover_image' => UploadedFile::fake()->create('cover.pdf', 10, 'application/pdf'),
        'highlights' => [['label' => 'Pengguna', 'value' => '']],
    ])->assertSessionHasErrors([
        'name' => 'Nama produk wajib diisi.',
        'slug',
        'website_url',
        'cover_image',
        'highlights.0.value',
    ]);
});

test('replaces the cover and removes the logo on update', function () {
    $logo = UploadedFile::fake()->image('logo.png')->store('products/logos', 'public');
    $cover = UploadedFile::fake()->image('old.jpg')->store('products', 'public');
    $product = Product::factory()->create(['logo' => $logo, 'cover_image' => $cover]);

    $this->put(route('admin.products.update', $product), [
        'name' => $product->name,
        'slug' => $product->slug,
        'cover_image' => UploadedFile::fake()->image('new.jpg'),
        'remove_logo' => '1',
    ])->assertSessionHasNoErrors();

    $product->refresh();

    expect($product->logo)->toBeNull()
        ->and($product->cover_image)->not->toBe($cover)
        ->and($product->isPublished())->toBeFalse();
    Storage::disk('public')->assertMissing([$logo, $cover]);
    Storage::disk('public')->assertExists($product->cover_image);
});

test('deletes a product and its images', function () {
    $cover = UploadedFile::fake()->image('cover.jpg')->store('products', 'public');
    $product = Product::factory()->create(['cover_image' => $cover]);

    $this->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    $this->assertModelMissing($product);
    Storage::disk('public')->assertMissing($cover);
});
