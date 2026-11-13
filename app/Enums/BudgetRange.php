<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum BudgetRange: string
{
    use HasOptions;

    case Under50m = 'under_50m';
    case From50mTo150m = '50m_150m';
    case From150mTo500m = '150m_500m';
    case Above500m = 'above_500m';
    case NotSure = 'not_sure';

    public function label(): string
    {
        return match ($this) {
            self::Under50m => '< Rp50 juta',
            self::From50mTo150m => 'Rp50–150 juta',
            self::From150mTo500m => 'Rp150–500 juta',
            self::Above500m => '> Rp500 juta',
            self::NotSure => 'Belum tahu',
        };
    }
}
