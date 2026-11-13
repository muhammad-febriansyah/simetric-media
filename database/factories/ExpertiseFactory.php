<?php

namespace Database\Factories;

use App\Models\Expertise;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Expertise>
 */
class ExpertiseFactory extends Factory
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
            'description' => fake()->sentence(12),
            'icon' => 'compass',
            'sort_order' => fake()->numberBetween(0, 10),
            'published_at' => now()->subDay(),
        ];
    }

    /**
     * Indicate that the expertise is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }
}
