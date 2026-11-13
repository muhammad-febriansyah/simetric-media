<?php

namespace Database\Factories;

use App\Enums\BudgetRange;
use App\Enums\BusinessFunction;
use App\Enums\CompanySize;
use App\Enums\LeadStatus;
use App\Enums\ProjectTimeline;
use App\Models\ConsultationRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConsultationRequest>
 */
class ConsultationRequestFactory extends Factory
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
            'assigned_to' => null,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('08##########'),
            'job_title' => fake()->jobTitle(),
            'company_name' => fake()->company(),
            'company_size' => fake()->randomElement(CompanySize::cases()),
            'problem_area' => fake()->randomElement(BusinessFunction::cases()),
            'problem_description' => fake()->paragraph(),
            'timeline' => fake()->randomElement(ProjectTimeline::cases()),
            'budget_range' => fake()->randomElement(BudgetRange::cases()),
            'status' => LeadStatus::New,
            'source_page' => null,
            'utm' => null,
        ];
    }
}
