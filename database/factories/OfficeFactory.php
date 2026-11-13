<?php

namespace Database\Factories;

use App\Enums\OfficeType;
use App\Models\Office;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Office>
 */
class OfficeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Kantor '.fake()->city(),
            'type' => OfficeType::Branch,
            'address' => fake()->address(),
            'city' => fake()->city(),
            'phone' => fake()->numerify('021-#######'),
            'email' => fake()->safeEmail(),
            'map_url' => null,
            'sort_order' => 0,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the office is the head office.
     */
    public function head(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => OfficeType::Head,
        ]);
    }
}
