<?php

namespace App\Models;

use App\Enums\OfficeType;
use Database\Factories\OfficeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property OfficeType $type
 * @property string $address
 * @property string $city
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $map_url
 * @property int $sort_order
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'type', 'address', 'city', 'phone', 'email', 'map_url', 'sort_order', 'is_active'])]
class Office extends Model
{
    /** @use HasFactory<OfficeFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => OfficeType::class,
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
