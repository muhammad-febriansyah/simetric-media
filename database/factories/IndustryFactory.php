<?php

namespace Database\Factories;

use App\Models\Industry;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Industry>
 */
class IndustryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Manufaktur', 'Distribusi & Logistik', 'Konstruksi', 'Pertambangan', 'Ritel',
            'Kesehatan', 'Pendidikan', 'Jasa Keuangan', 'Agribisnis', 'Energi',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(4)),
            'summary' => fake()->sentence(15),
            'pain_points' => fake()->sentences(3),
            'icon' => 'factory',
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
