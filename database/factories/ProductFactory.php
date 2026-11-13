<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(4)),
            'category' => fake()->randomElement(['SaaS', 'Marketplace', 'Platform Layanan']),
            'tagline' => fake()->sentence(6),
            'summary' => fake()->paragraph(),
            'body' => fake()->paragraphs(2, true),
            'website_url' => fake()->url(),
            'features' => [
                ['title' => fake()->words(3, true), 'description' => fake()->sentence()],
            ],
            'highlights' => [
                ['label' => fake()->words(2, true), 'value' => (string) fake()->numberBetween(10, 500)],
            ],
            'is_featured' => false,
            'sort_order' => fake()->numberBetween(0, 20),
            'published_at' => now()->subDay(),
        ];
    }

    /**
     * Indicate that the product is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the product is highlighted on the home page.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
