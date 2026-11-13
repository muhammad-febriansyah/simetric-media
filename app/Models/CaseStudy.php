<?php

namespace App\Models;

use App\Casts\RichTextHtml;
use App\Enums\OrganizationType;
use App\Models\Concerns\HasPublication;
use Database\Factories\CaseStudyFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int|null $industry_id
 * @property string $title
 * @property string $slug
 * @property string $client_name
 * @property string|null $project_period
 * @property OrganizationType|null $organization_type
 * @property string|null $excerpt
 * @property string|null $cover_image
 * @property string $challenge
 * @property string|null $assessment
 * @property string|null $recommendation
 * @property string $solution
 * @property list<array{label: string, value: string}>|null $results
 * @property list<array{title: string, description: string|null}>|null $key_insights
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property bool $is_featured
 * @property int $sort_order
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read string|null $cover_image_url
 */
#[Fillable([
    'industry_id', 'title', 'slug', 'client_name', 'project_period', 'organization_type', 'excerpt', 'cover_image',
    'challenge', 'assessment', 'recommendation', 'solution', 'results', 'key_insights', 'is_featured', 'sort_order',
    'meta_title', 'meta_description', 'published_at',
])]
#[Appends(['cover_image_url'])]
class CaseStudy extends Model
{
    /** @use HasFactory<CaseStudyFactory> */
    use HasFactory, HasPublication, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'challenge' => RichTextHtml::class,
            'assessment' => RichTextHtml::class,
            'recommendation' => RichTextHtml::class,
            'solution' => RichTextHtml::class,
            'organization_type' => OrganizationType::class,
            'results' => 'array',
            'key_insights' => 'array',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Industry, $this>
     */
    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    /**
     * @return BelongsToMany<Service, $this>
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class);
    }

    /**
     * @return BelongsToMany<Solution, $this>
     */
    public function solutions(): BelongsToMany
    {
        return $this->belongsToMany(Solution::class);
    }

    /**
     * @return HasOne<Testimonial, $this>
     */
    public function testimonial(): HasOne
    {
        return $this->hasOne(Testimonial::class);
    }

    /**
     * @return HasMany<CaseStudyImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(CaseStudyImage::class)->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Public URL of the cover image stored on the public disk.
     *
     * @return Attribute<string|null, never>
     */
    protected function coverImageUrl(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null,
        );
    }
}
