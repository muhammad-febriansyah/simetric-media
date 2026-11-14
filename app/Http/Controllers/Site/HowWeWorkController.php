<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use Inertia\Inertia;
use Inertia\Response;

class HowWeWorkController extends Controller
{
    /**
     * Show the seven-step consulting process with its FAQs.
     */
    public function __invoke(): Response
    {
        return Inertia::render('site/how-we-work', [
            'process' => config('company.process'),
            'faqs' => FaqResource::collection(
                Faq::query()->where('page', 'how-we-work')->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(),
            )->resolve(),
        ]);
    }
}
