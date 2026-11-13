<?php

namespace App\Http\Resources;

use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Office
 */
class OfficeResource extends JsonResource
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
            'type' => $this->type->toOption(),
            'address' => $this->address,
            'city' => $this->city,
            'phone' => $this->phone,
            'email' => $this->email,
            'map_url' => $this->map_url,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
