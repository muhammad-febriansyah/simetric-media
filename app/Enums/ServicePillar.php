<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum ServicePillar: string
{
    use HasOptions;

    case Consulting = 'consulting';
    case Design = 'design';
    case Development = 'development';
    case Support = 'support';

    public function label(): string
    {
        return match ($this) {
            self::Consulting => 'Konsultasi & Strategi',
            self::Design => 'Desain',
            self::Development => 'Pengembangan',
            self::Support => 'Pendampingan',
        };
    }
}
