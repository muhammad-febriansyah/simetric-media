<?php

namespace App\Models;

use Database\Factories\ClientLogoFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int|null $industry_id
 * @property int|null $product_id
 * @property string $name
 * @property string $logo
 * @property string|null $website_url
 * @property int $sort_order
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $logo_url
 */
#[Fillable(['industry_id', 'product_id', 'name', 'logo', 'website_url', 'sort_order', 'is_active'])]
#[Appends(['logo_url'])]
class ClientLogo extends Model
{
    /** @use HasFactory<ClientLogoFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
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
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Public URL of the logo stored on the public disk.
     *
     * @return Attribute<string, never>
     */
    protected function logoUrl(): Attribute
    {
        return Attribute::get(fn (): string => Storage::disk('public')->url($this->logo));
    }
}
