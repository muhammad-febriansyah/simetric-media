<?php

namespace App\Models;

use App\Models\Concerns\HasPublication;
use Database\Factories\ExpertiseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * An area of expertise (e.g. Konsultasi & Strategi) grouping the services on the /keahlian page.
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $icon
 * @property int $sort_order
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'slug', 'description', 'icon', 'sort_order', 'meta_title', 'meta_description', 'published_at'])]
class Expertise extends Model
{
    /** @use HasFactory<ExpertiseFactory> */
    use HasFactory, HasPublication;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<Service, $this>
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
}
