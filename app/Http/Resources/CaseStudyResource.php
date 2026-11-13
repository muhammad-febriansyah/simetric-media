<?php

namespace App\Http\Resources;

use App\Models\CaseStudy;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CaseStudy
 */
class CaseStudyResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'client_name' => $this->client_name,
            'project_period' => $this->project_period,
            'organization_type' => $this->organization_type?->toOption(),
            'excerpt' => $this->excerpt,
            'cover_image_url' => $this->cover_image_url,
            'challenge' => $this->challenge,
            'assessment' => $this->assessment,
            'recommendation' => $this->recommendation,
            'solution' => $this->solution,
            'results' => $this->results ?? [],
            'key_insights' => $this->key_insights ?? [],
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
            'is_published' => $this->isPublished(),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'images' => $this->whenLoaded('images', fn (): array => $this->images->map->only(['id', 'url', 'caption', 'sort_order'])->all()),
            'solutions' => $this->whenLoaded('solutions', fn (): array => $this->solutions->map->only(['id', 'name', 'slug'])->all()),
            'industry' => $this->whenLoaded('industry', fn (): ?array => $this->industry?->only(['id', 'name', 'slug'])),
            'services' => $this->whenLoaded('services', fn (): array => $this->services->map->only(['id', 'name', 'slug'])->all()),
        ];
    }
}
