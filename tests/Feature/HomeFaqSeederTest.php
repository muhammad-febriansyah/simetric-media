<?php

use App\Models\Faq;
use Database\Seeders\HomeFaqSeeder;

test('seeds home page FAQs once without overwriting answers edited in the admin', function () {
    $this->seed(HomeFaqSeeder::class);
    $seededCount = Faq::query()->where('page', 'home')->count();

    $edited = Faq::query()->where('page', 'home')->firstOrFail();
    $edited->update(['answer' => '<p>Jawaban dari admin.</p>']);

    $this->seed(HomeFaqSeeder::class);

    expect($seededCount)->toBeGreaterThan(0)
        ->and(Faq::query()->where('page', 'home')->count())->toBe($seededCount)
        ->and($edited->fresh()->answer)->toBe('<p>Jawaban dari admin.</p>');
});
