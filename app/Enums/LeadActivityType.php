<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum LeadActivityType: string
{
    use HasOptions;

    case Created = 'created';
    case StatusChanged = 'status_changed';
    case Assigned = 'assigned';
    case Note = 'note';

    public function label(): string
    {
        return match ($this) {
            self::Created => 'Lead masuk',
            self::StatusChanged => 'Status diubah',
            self::Assigned => 'PIC diubah',
            self::Note => 'Catatan',
        };
    }
}
