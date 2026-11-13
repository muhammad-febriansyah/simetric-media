<?php

namespace App\Models;

use App\Enums\LeadActivityType;
use App\Enums\LeadStatus;
use Database\Factories\LeadActivityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $consultation_request_id
 * @property int|null $user_id
 * @property LeadActivityType $type
 * @property LeadStatus|null $from_status
 * @property LeadStatus|null $to_status
 * @property string|null $note
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['consultation_request_id', 'user_id', 'type', 'from_status', 'to_status', 'note'])]
class LeadActivity extends Model
{
    /** @use HasFactory<LeadActivityFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => LeadActivityType::class,
            'from_status' => LeadStatus::class,
            'to_status' => LeadStatus::class,
        ];
    }

    /**
     * @return BelongsTo<ConsultationRequest, $this>
     */
    public function consultationRequest(): BelongsTo
    {
        return $this->belongsTo(ConsultationRequest::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
