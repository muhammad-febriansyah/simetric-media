<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ExpertiseResource;
use App\Models\Article;
use App\Models\Expertise;
use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Inertia\Inertia;
use Inertia\Response;

class ExpertiseController extends Controller
{
    /**
     * Show the published areas of expertise with their services and the latest related insights.
     */
    public function index(): Response
    {
        $settings = SiteSetting::values();

        return Inertia::render('site/expertises/index', [
            'intro' => [
                'title' => $settings['expertise_page_title'],
                'description' => $settings['expertise_page_description'],
            ],
            'expertises' => ExpertiseResource::collection(
                Expertise::query()
                    ->published()
                    ->with(['services' => fn (HasMany $query) => $query->published()->ordered()])
                    ->whereHas('services', fn ($query) => $query->published())
                    ->ordered()
                    ->get(),
            )->resolve(),
            'articles' => ArticleResource::collection(
                Article::query()->published()->whereHas('services')->latest('published_at')->limit(8)->get(),
            )->resolve(),
        ]);
    }
}
