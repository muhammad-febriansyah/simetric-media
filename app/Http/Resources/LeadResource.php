<?php

namespace App\Http\Resources;

use App\Models\ConsultationRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ConsultationRequest
 */
class LeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'job_title' => $this->job_title,
            'company_name' => $this->company_name,
            'company_size' => $this->company_size?->toOption(),
            'problem_area' => $this->problem_area->toOption(),
            'problem_description' => $this->problem_description,
            'timeline' => $this->timeline?->toOption(),
            'budget_range' => $this->budget_range?->toOption(),
            'status' => $this->status->toOption(),
            'source_page' => $this->source_page,
            'utm' => $this->utm ?? [],
            'industry' => $this->whenLoaded('industry', fn (): ?array => $this->industry?->only(['id', 'name'])),
            'assignee' => $this->whenLoaded('assignee', fn (): ?array => $this->assignee?->only(['id', 'name'])),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_label' => $this->created_at?->translatedFormat('d M Y, H:i'),
        ];
    }
}
