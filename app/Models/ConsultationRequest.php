<?php

namespace App\Models;

use App\Enums\BudgetRange;
use App\Enums\BusinessFunction;
use App\Enums\CompanySize;
use App\Enums\LeadActivityType;
use App\Enums\LeadStatus;
use App\Enums\ProjectTimeline;
use Database\Factories\ConsultationRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $industry_id
 * @property int|null $assigned_to
 * @property string $name
 * @property string $email
 * @property string $phone
 * @property string|null $job_title
 * @property string $company_name
 * @property CompanySize|null $company_size
 * @property BusinessFunction $problem_area
 * @property string $problem_description
 * @property ProjectTimeline|null $timeline
 * @property BudgetRange|null $budget_range
 * @property LeadStatus $status
 * @property string|null $source_page
 * @property array<string, string>|null $utm
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'industry_id', 'assigned_to', 'name', 'email', 'phone', 'job_title', 'company_name', 'company_size',
    'problem_area', 'problem_description', 'timeline', 'budget_range', 'status', 'source_page', 'utm',
])]
class ConsultationRequest extends Model
{
    /** @use HasFactory<ConsultationRequestFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => 'new',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'company_size' => CompanySize::class,
            'problem_area' => BusinessFunction::class,
            'timeline' => ProjectTimeline::class,
            'budget_range' => BudgetRange::class,
            'status' => LeadStatus::class,
            'utm' => 'array',
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
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * @return HasMany<LeadActivity, $this>
     */
    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class);
    }

    /**
     * Record an entry in the lead's activity timeline.
     *
     * @param  array{from_status?: LeadStatus|null, to_status?: LeadStatus|null, note?: string|null}  $attributes
     */
    public function recordActivity(LeadActivityType $type, ?User $user = null, array $attributes = []): LeadActivity
    {
        return $this->activities()->create([
            'type' => $type,
            'user_id' => $user?->id,
            ...$attributes,
        ]);
    }
}
