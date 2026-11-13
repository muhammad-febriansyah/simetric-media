<?php

namespace App\Models;

use App\Casts\RichTextHtml;
use App\Models\Concerns\HasPublication;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * A digital product built and run by the company (e.g. a SaaS platform), shown as proof
 * that the team can take an idea all the way to a live application.
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $category
 * @property string|null $tagline
 * @property string|null $summary
 * @property string|null $body
 * @property string|null $website_url
 * @property string|null $logo
 * @property string|null $cover_image
 * @property list<array{title: string, description: string|null}>|null $features
 * @property list<array{label: string, value: string}>|null $highlights
 * @property bool $is_featured
 * @property int $sort_order
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $logo_url
 * @property-read string|null $cover_image_url
 */
#[Fillable([
    'name', 'slug', 'category', 'tagline', 'summary', 'body', 'website_url', 'logo', 'cover_image',
    'features', 'highlights', 'is_featured', 'sort_order', 'meta_title', 'meta_description', 'published_at',
])]
#[Appends(['logo_url', 'cover_image_url'])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory, HasPublication;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'body' => RichTextHtml::class,
            'features' => 'array',
            'highlights' => 'array',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<Testimonial, $this>
     */
    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    /**
     * @return HasMany<ClientLogo, $this>
     */
    public function clientLogos(): HasMany
    {
        return $this->hasMany(ClientLogo::class);
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function logoUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->logo ? Storage::disk('public')->url($this->logo) : null);
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function coverImageUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null);
    }
}
