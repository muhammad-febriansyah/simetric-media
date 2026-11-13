<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
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
            'email' => $this->email,
            'is_admin' => $this->is_admin,
            'is_current' => $this->is($request->user()),
            'two_factor_enabled' => $this->two_factor_confirmed_at !== null,
            'assigned_leads_count' => $this->whenCounted('assignedLeads'),
            'created_at_label' => $this->created_at?->translatedFormat('d M Y'),
        ];
    }
}
