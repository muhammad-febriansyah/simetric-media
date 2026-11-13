<?php

namespace Database\Factories;

use App\Models\Expertise;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(4)),
            'expertise_id' => Expertise::factory(),
            'headline' => fake()->sentence(8),
            'problem_statement' => fake()->paragraph(),
            'body' => fake()->paragraphs(3, true),
            'capabilities' => [
                ['title' => fake()->words(3, true), 'description' => fake()->sentence()],
                ['title' => fake()->words(3, true), 'description' => fake()->sentence()],
            ],
            'methodology' => [
                ['title' => 'Discovery', 'description' => fake()->sentence()],
                ['title' => 'Implementasi', 'description' => fake()->sentence()],
            ],
            'icon' => 'briefcase',
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
}
