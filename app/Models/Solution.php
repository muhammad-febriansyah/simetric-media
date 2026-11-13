<?php

namespace App\Models;

use App\Casts\RichTextHtml;
use App\Enums\BusinessFunction;
use App\Models\Concerns\HasPublication;
use Database\Factories\SolutionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * A solution grouped by the business function it improves (e.g. sales, finance).
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property BusinessFunction $business_function
 * @property string|null $headline
 * @property string|null $problem_statement
 * @property string|null $body
 * @property list<array{title: string, description: string|null}>|null $features
 * @property string|null $icon
 * @property int $sort_order
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name', 'slug', 'business_function', 'headline', 'problem_statement', 'body', 'features', 'icon',
    'sort_order', 'meta_title', 'meta_description', 'published_at',
])]
class Solution extends Model
{
    /** @use HasFactory<SolutionFactory> */
    use HasFactory, HasPublication;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'body' => RichTextHtml::class,
            'business_function' => BusinessFunction::class,
            'features' => 'array',
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
     * @return MorphMany<Faq, $this>
     */
    public function faqs(): MorphMany
    {
        return $this->morphMany(Faq::class, 'faqable');
    }
}
