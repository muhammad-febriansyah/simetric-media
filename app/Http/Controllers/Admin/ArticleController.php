<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StoresPublicImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    use StoresPublicImages;

    /**
     * List all articles.
     */
    public function index(): Response
    {
        return Inertia::render('admin/articles/index', [
            'articles' => ArticleResource::collection(
                Article::query()->with('author')->latest()->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/articles/form', [
            'article' => null,
            ...$this->formOptions(),
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(ArticleRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $article = Article::query()->create([
                ...$request->safe()->except(['cover_image', 'remove_cover_image', 'service_ids', 'is_published']),
                'author_id' => $request->user()->id,
                'cover_image' => $request->file('cover_image')?->store('articles', 'public'),
                'published_at' => $request->publishedAt(),
            ]);

            $article->services()->sync($request->validated('service_ids', []));
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil ditambahkan.']);

        return to_route('admin.articles.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(Article $article): Response
    {
        $article->load('services');

        return Inertia::render('admin/articles/form', [
            'article' => (new ArticleResource($article))->resolve(),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(ArticleRequest $request, Article $article): RedirectResponse
    {
        [$coverImage, $previousCoverImage] = $this->resolveImage($request, 'cover_image', $article->cover_image, 'articles', 'remove_cover_image');

        DB::transaction(function () use ($request, $article, $coverImage): void {
            $article->update([
                ...$request->safe()->except(['cover_image', 'remove_cover_image', 'service_ids', 'is_published']),
                'cover_image' => $coverImage,
                'published_at' => $request->publishedAt($article->published_at),
            ]);

            $article->services()->sync($request->validated('service_ids', []));
        });

        $this->deletePublicFiles($previousCoverImage);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil diperbarui.']);

        return to_route('admin.articles.index');
    }

    /**
     * Delete a record.
     */
    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil dihapus.']);

        return to_route('admin.articles.index');
    }

    /**
     * Select options for the article form.
     *
     * @return array{serviceOptions: mixed}
     */
    private function formOptions(): array
    {
        return [
            'serviceOptions' => Service::query()->ordered()->get(['id', 'name'])
                ->map(fn (Service $service): array => ['value' => (string) $service->id, 'label' => $service->name]),
        ];
    }
}
