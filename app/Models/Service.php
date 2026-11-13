<?php

namespace App\Models;

use App\Enums\ServicePillar;
use App\Models\Concerns\HasPublication;
use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property ServicePillar $pillar
 * @property string|null $headline
 * @property string|null $problem_statement
 * @property string|null $body
 * @property list<array{title: string, description: string|null}>|null $capabilities
 * @property list<array{title: string, description: string|null}>|null $methodology
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property string|null $icon
 * @property int $sort_order
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name', 'slug', 'pillar', 'headline', 'problem_statement', 'body', 'capabilities', 'methodology', 'icon',
    'sort_order', 'meta_title', 'meta_description', 'published_at',
])]
class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory, HasPublication;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pillar' => ServicePillar::class,
            'capabilities' => 'array',
            'methodology' => 'array',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsToMany<CaseStudy, $this>
     */
    public function caseStudies(): BelongsToMany
    {
        return $this->belongsToMany(CaseStudy::class);
    }

    /**
     * @return BelongsToMany<Article, $this>
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class);
    }

    /**
     * @return MorphMany<Faq, $this>
     */
    public function faqs(): MorphMany
    {
        return $this->morphMany(Faq::class, 'faqable');
    }
}
