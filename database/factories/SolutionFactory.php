<?php

namespace Database\Factories;

use App\Enums\BusinessFunction;
use App\Models\Solution;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Solution>
 */
class SolutionFactory extends Factory
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
            'business_function' => fake()->randomElement(BusinessFunction::cases()),
            'headline' => fake()->sentence(8),
            'problem_statement' => fake()->paragraph(),
            'body' => fake()->paragraphs(2, true),
            'features' => [
                ['title' => fake()->words(3, true), 'description' => fake()->sentence()],
            ],
            'icon' => 'briefcase',
            'sort_order' => fake()->numberBetween(0, 20),
            'published_at' => now()->subDay(),
        ];
    }

    /**
     * Indicate that the solution is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }
}
