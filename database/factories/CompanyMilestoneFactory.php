<?php

namespace Database\Factories;

use App\Models\CompanyMilestone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CompanyMilestone>
 */
class CompanyMilestoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'year' => fake()->numberBetween(2015, 2026),
            'title' => fake()->sentence(4),
            'description' => fake()->sentence(15),
            'sort_order' => 0,
        ];
    }
}
