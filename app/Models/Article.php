<?php

namespace App\Models;

use App\Models\Concerns\HasPublication;
use Database\Factories\ArticleFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int|null $author_id
 * @property string $title
 * @property string $slug
 * @property string|null $category
 * @property string|null $excerpt
 * @property string $body
 * @property string|null $cover_image
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read string|null $cover_image_url
 */
#[Fillable([
    'author_id', 'title', 'slug', 'category', 'excerpt', 'body', 'cover_image', 'meta_title', 'meta_description', 'published_at',
])]
#[Appends(['cover_image_url'])]
class Article extends Model
{
    /** @use HasFactory<ArticleFactory> */
    use HasFactory, HasPublication, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return BelongsToMany<Service, $this>
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class);
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
