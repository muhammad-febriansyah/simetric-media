<?php

namespace Database\Factories;

use App\Models\CaseStudy;
use App\Models\Industry;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CaseStudy>
 */
class CaseStudyFactory extends Factory
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
            'industry_id' => Industry::factory(),
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(4)),
            'client_name' => fake()->company(),
            'excerpt' => fake()->sentence(18),
            'cover_image' => null,
            'challenge' => fake()->paragraph(),
            'assessment' => fake()->paragraph(),
            'recommendation' => fake()->paragraph(),
            'solution' => fake()->paragraph(),
            'results' => [
                ['label' => 'Waktu proses', 'value' => '-'.fake()->numberBetween(20, 70).'%'],
                ['label' => 'Akurasi data', 'value' => fake()->numberBetween(90, 99).'%'],
            ],
            'is_featured' => false,
            'sort_order' => fake()->numberBetween(0, 20),
            'published_at' => now()->subDay(),
        ];
    }

    /**
     * Indicate that the record is a draft (not visible on the website).
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the case study is highlighted on the home page.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
