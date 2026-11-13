<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(6);

        return [
            'author_id' => null,
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(4)),
            'category' => fake()->randomElement(['Strategi', 'Teknologi', 'Operasional']),
            'excerpt' => fake()->sentence(18),
            'body' => fake()->paragraphs(4, true),
            'cover_image' => null,
            'meta_title' => null,
            'meta_description' => null,
            'published_at' => now()->subDay(),
        ];
    }

    /**
     * Indicate that the article is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }
}
