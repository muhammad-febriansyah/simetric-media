<?php

namespace App\Http\Resources;

use App\Models\CompanyMilestone;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CompanyMilestone
 */
class CompanyMilestoneResource extends JsonResource
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
            'year' => $this->year,
            'title' => $this->title,
            'description' => $this->description,
            'sort_order' => $this->sort_order,
        ];
    }
}
