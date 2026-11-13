<?php

namespace App\Http\Resources;

use App\Models\LeadActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin LeadActivity
 */
class LeadActivityResource extends JsonResource
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
            'type' => $this->type->toOption(),
            'from_status' => $this->from_status?->toOption(),
            'to_status' => $this->to_status?->toOption(),
            'note' => $this->note,
            'user' => $this->whenLoaded('user', fn (): ?array => $this->user?->only(['id', 'name'])),
            'created_at_label' => $this->created_at?->translatedFormat('d M Y, H:i'),
        ];
    }
}
