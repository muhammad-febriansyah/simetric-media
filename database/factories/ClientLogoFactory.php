<?php

namespace Database\Factories;

use App\Models\ClientLogo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ClientLogo>
 */
class ClientLogoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'industry_id' => null,
            'name' => fake()->company(),
            'logo' => 'client-logos/'.fake()->uuid().'.png',
            'website_url' => fake()->url(),
            'sort_order' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the logo is hidden from the website.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
