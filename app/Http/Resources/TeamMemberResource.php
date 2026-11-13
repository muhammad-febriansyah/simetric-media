<?php

namespace App\Http\Resources;

use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TeamMember
 */
class TeamMemberResource extends JsonResource
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
            'position' => $this->position,
            'bio' => $this->bio,
            'photo_url' => $this->photo_url,
            'linkedin_url' => $this->linkedin_url,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
