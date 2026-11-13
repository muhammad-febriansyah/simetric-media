<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StoresPublicImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use StoresPublicImages;

    /**
     * Fields handled separately from the validated payload.
     *
     * @var list<string>
     */
    private const EXCLUDED_FIELDS = ['logo', 'remove_logo', 'cover_image', 'remove_cover_image', 'is_published'];

    /**
     * List all products.
     */
    public function index(): Response
    {
        return Inertia::render('admin/products/index', [
            'products' => ProductResource::collection(Product::query()->ordered()->get())->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => null,
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(ProductRequest $request): RedirectResponse
    {
        Product::query()->create([
            ...$request->safe()->except(self::EXCLUDED_FIELDS),
            'logo' => $request->file('logo')?->store('products/logos', 'public'),
            'cover_image' => $request->file('cover_image')?->store('products', 'public'),
            'features' => $request->validated('features', []),
            'highlights' => $request->validated('highlights', []),
            'is_featured' => $request->boolean('is_featured'),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil ditambahkan.']);

        return to_route('admin.products.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => (new ProductResource($product))->resolve(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        [$logo, $previousLogo] = $this->resolveImage($request, 'logo', $product->logo, 'products/logos', 'remove_logo');
        [$coverImage, $previousCoverImage] = $this->resolveImage($request, 'cover_image', $product->cover_image, 'products', 'remove_cover_image');

        $product->update([
            ...$request->safe()->except(self::EXCLUDED_FIELDS),
            'logo' => $logo,
            'cover_image' => $coverImage,
            'features' => $request->validated('features', []),
            'highlights' => $request->validated('highlights', []),
            'is_featured' => $request->boolean('is_featured'),
            'sort_order' => $request->integer('sort_order'),
            'published_at' => $request->publishedAt($product->published_at),
        ]);

        $this->deletePublicFiles($previousLogo, $previousCoverImage);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil diperbarui.']);

        return to_route('admin.products.index');
    }

    /**
     * Delete a record and its images.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();
        $this->deletePublicFiles($product->logo, $product->cover_image);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil dihapus.']);

        return to_route('admin.products.index');
    }
}
