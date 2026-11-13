<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum ProjectTimeline: string
{
    use HasOptions;

    case Asap = 'asap';
    case OneToThreeMonths = '1-3_months';
    case ThreeToSixMonths = '3-6_months';
    case Exploring = 'exploring';

    public function label(): string
    {
        return match ($this) {
            self::Asap => 'Secepatnya',
            self::OneToThreeMonths => '1–3 bulan',
            self::ThreeToSixMonths => '3–6 bulan',
            self::Exploring => 'Masih menjajaki',
        };
    }
}
