<?php

namespace Database\Factories;

use App\Enums\LeadActivityType;
use App\Models\ConsultationRequest;
use App\Models\LeadActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeadActivity>
 */
class LeadActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'consultation_request_id' => ConsultationRequest::factory(),
            'user_id' => null,
            'type' => LeadActivityType::Note,
            'from_status' => null,
            'to_status' => null,
            'note' => fake()->sentence(),
        ];
    }
}
