<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HowWeWorkController extends Controller
{
    /**
     * Show the seven-step consulting process.
     */
    public function __invoke(): Response
    {
        return Inertia::render('site/how-we-work', [
            'process' => config('company.process'),
        ]);
    }
}
