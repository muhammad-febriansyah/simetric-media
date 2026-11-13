<?php

use App\Models\ClientLogo;
use App\Models\Product;
use App\Models\Testimonial;
use Database\Seeders\ProductSeeder;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('seeds the company products with bundled images', function () {
    $this->seed(ProductSeeder::class);

    expect(Product::query()->ordered()->pluck('slug')->all())->toBe(['legalpartner', 'chatcepat', 'karirconnect']);

    Product::query()->each(function (Product $product): void {
        expect($product->isPublished())->toBeTrue()
            ->and($product->is_featured)->toBeTrue();
        Storage::disk('public')->assertExists([$product->logo, $product->cover_image]);
    });
});

test('keeps images and featured flag changed in the admin panel when seeding again', function () {
    $this->seed(ProductSeeder::class);
    Product::query()->where('slug', 'chatcepat')->update(['cover_image' => 'products/custom.jpg', 'is_featured' => false]);

    $this->seed(ProductSeeder::class);

    $product = Product::query()->where('slug', 'chatcepat')->sole();

    expect(Product::query()->count())->toBe(3)
        ->and($product->cover_image)->toBe('products/custom.jpg')
        ->and($product->is_featured)->toBeFalse();
});

test('links the product partners and testimonials to their product', function () {
    $this->seed(ProductSeeder::class);
    $this->seed(ProductSeeder::class);

    $products = Product::query()->pluck('id', 'slug');

    expect(ClientLogo::query()->where('product_id', $products['legalpartner'])->count())->toBe(5)
        ->and(ClientLogo::query()->where('product_id', $products['karirconnect'])->count())->toBe(21)
        ->and(Testimonial::query()->where('product_id', $products['chatcepat'])->count())->toBe(6);

    ClientLogo::query()->each(fn (ClientLogo $clientLogo) => Storage::disk('public')->assertExists($clientLogo->logo));
});
