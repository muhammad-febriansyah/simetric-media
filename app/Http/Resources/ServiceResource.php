<?php

namespace App\Http\Resources;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Service
 */
class ServiceResource extends JsonResource
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
            'pillar' => $this->pillar->toOption(),
            'headline' => $this->headline,
            'problem_statement' => $this->problem_statement,
            'body' => $this->body,
            'capabilities' => $this->capabilities ?? [],
            'methodology' => $this->methodology ?? [],
            'icon' => $this->icon,
            'sort_order' => $this->sort_order,
            'is_published' => $this->isPublished(),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'case_studies_count' => $this->whenCounted('caseStudies'),
        ];
    }
}
