<?php

namespace App\Http\Resources;

use App\Models\Expertise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Expertise
 */
class ExpertiseResource extends JsonResource
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
            'description' => $this->description,
            'icon' => $this->icon,
            'sort_order' => $this->sort_order,
            'is_published' => $this->isPublished(),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'services_count' => $this->whenCounted('services'),
            'services' => $this->whenLoaded('services', fn (): array => ServiceResource::collection($this->services)->resolve()),
        ];
    }
}
