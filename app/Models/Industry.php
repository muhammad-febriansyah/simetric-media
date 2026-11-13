<?php

namespace App\Models;

use App\Models\Concerns\HasPublication;
use Database\Factories\IndustryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $summary
 * @property list<string>|null $pain_points
 * @property string|null $icon
 * @property int $sort_order
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'slug', 'summary', 'pain_points', 'icon', 'sort_order', 'meta_title', 'meta_description', 'published_at'])]
class Industry extends Model
{
    /** @use HasFactory<IndustryFactory> */
    use HasFactory, HasPublication;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pain_points' => 'array',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<CaseStudy, $this>
     */
    public function caseStudies(): HasMany
    {
        return $this->hasMany(CaseStudy::class);
    }

    /**
     * @return HasMany<ClientLogo, $this>
     */
    public function clientLogos(): HasMany
    {
        return $this->hasMany(ClientLogo::class);
    }

    /**
     * @return MorphMany<Faq, $this>
     */
    public function faqs(): MorphMany
    {
        return $this->morphMany(Faq::class, 'faqable');
    }

    /**
     * @return HasMany<ConsultationRequest, $this>
     */
    public function consultationRequests(): HasMany
    {
        return $this->hasMany(ConsultationRequest::class);
    }
}
