<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /**
     * List published insights, filterable by category.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'category' => ['nullable', 'string', 'max:50'],
        ]);

        $articles = Article::query()
            ->published()
            ->when($filters['category'] ?? null, fn (Builder $query, string $category) => $query->where('category', $category))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('site/insights/index', [
            'articles' => [
                'data' => ArticleResource::collection($articles->items())->resolve(),
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
                    'total' => $articles->total(),
                ],
            ],
            'filters' => ['category' => $filters['category'] ?? ''],
            'categories' => Article::query()->published()->whereNotNull('category')->distinct()->orderBy('category')->pluck('category'),
        ]);
    }

    /**
     * Show a published insight with related services and other insights.
     */
    public function show(Article $article): Response
    {
        abort_unless($article->isPublished(), 404);

        $article->load(['author', 'services']);

        return Inertia::render('site/insights/show', [
            'article' => (new ArticleResource($article))->resolve(),
            'relatedArticles' => ArticleResource::collection(
                Article::query()->published()->whereKeyNot($article->id)->latest('published_at')->limit(3)->get(),
            )->resolve(),
        ]);
    }
}
