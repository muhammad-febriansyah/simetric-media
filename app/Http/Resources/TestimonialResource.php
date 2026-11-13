<?php

namespace App\Http\Resources;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Testimonial
 */
class TestimonialResource extends JsonResource
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
            'author_name' => $this->author_name,
            'author_position' => $this->author_position,
            'company' => $this->company,
            'quote' => $this->quote,
            'photo_url' => $this->photo_url,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'case_study' => $this->whenLoaded('caseStudy', fn (): ?array => $this->caseStudy?->only(['id', 'title'])),
            'product' => $this->whenLoaded('product', fn (): ?array => $this->product?->only(['id', 'name'])),
        ];
    }
}
