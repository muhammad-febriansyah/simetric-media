<?php

namespace App\Models;

use Database\Factories\CompanyMilestoneFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A point in the company history timeline shown on the About page.
 *
 * @property int $id
 * @property int $year
 * @property string $title
 * @property string|null $description
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['year', 'title', 'description', 'sort_order'])]
class CompanyMilestone extends Model
{
    /** @use HasFactory<CompanyMilestoneFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
