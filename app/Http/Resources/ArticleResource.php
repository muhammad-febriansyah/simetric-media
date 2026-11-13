<?php

namespace App\Http\Resources;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Article
 */
class ArticleResource extends JsonResource
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
            'category' => $this->category,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'cover_image_url' => $this->cover_image_url,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'is_published' => $this->isPublished(),
            'published_at_label' => $this->published_at?->translatedFormat('d M Y'),
            'author' => $this->whenLoaded('author', fn (): ?array => $this->author?->only(['id', 'name'])),
            'services' => $this->whenLoaded('services', fn (): array => $this->services->map->only(['id', 'name', 'slug'])->all()),
        ];
    }
}
