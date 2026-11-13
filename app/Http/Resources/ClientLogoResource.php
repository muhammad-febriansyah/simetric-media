<?php

namespace App\Http\Resources;

use App\Models\ClientLogo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ClientLogo
 */
class ClientLogoResource extends JsonResource
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
            'logo_url' => $this->logo_url,
            'website_url' => $this->website_url,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'industry' => $this->whenLoaded('industry', fn (): ?array => $this->industry?->only(['id', 'name'])),
        ];
    }
}
