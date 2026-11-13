<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
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
            'category' => $this->category,
            'tagline' => $this->tagline,
            'summary' => $this->summary,
            'body' => $this->body,
            'website_url' => $this->website_url,
            'logo_url' => $this->logo_url,
            'cover_image_url' => $this->cover_image_url,
            'features' => $this->features ?? [],
            'highlights' => $this->highlights ?? [],
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
            'is_published' => $this->isPublished(),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
        ];
    }
}
