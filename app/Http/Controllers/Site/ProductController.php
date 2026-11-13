<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientLogoResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * List the published products.
     */
    public function index(): Response
    {
        return Inertia::render('site/products/index', [
            'products' => ProductResource::collection(Product::query()->published()->ordered()->get())->resolve(),
        ]);
    }

    /**
     * Show a published product with its users (logos, testimonials) and the other products.
     */
    public function show(Product $product): Response
    {
        abort_unless($product->isPublished(), 404);

        return Inertia::render('site/products/show', [
            'product' => (new ProductResource($product))->resolve(),
            'clientLogos' => ClientLogoResource::collection(
                $product->clientLogos()->where('is_active', true)->orderBy('sort_order')->orderBy('name')->get(),
            )->resolve(),
            'testimonials' => TestimonialResource::collection(
                $product->testimonials()->where('is_active', true)->orderBy('sort_order')->get(),
            )->resolve(),
            'otherProducts' => ProductResource::collection(
                Product::query()->published()->whereKeyNot($product->id)->ordered()->limit(3)->get(),
            )->resolve(),
        ]);
    }
}
