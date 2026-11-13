<?php

namespace App\Http\Resources;

use App\Models\Industry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Industry
 */
class IndustryResource extends JsonResource
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
            'slug' => $this->slug,
            'summary' => $this->summary,
            'pain_points' => $this->pain_points ?? [],
            'icon' => $this->icon,
            'sort_order' => $this->sort_order,
            'is_published' => $this->isPublished(),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'case_studies_count' => $this->whenCounted('caseStudies'),
        ];
    }
}
