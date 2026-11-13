<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum OrganizationType: string
{
    use HasOptions;

    case Corporate = 'corporate';
    case Sme = 'sme';
    case Government = 'government';
    case StateOwned = 'state_owned';
    case NonProfit = 'non_profit';
    case Education = 'education';

    public function label(): string
    {
        return match ($this) {
            self::Corporate => 'Korporasi',
            self::Sme => 'UMKM',
            self::Government => 'Pemerintahan',
            self::StateOwned => 'BUMN',
            self::NonProfit => 'Nirlaba / NGO',
            self::Education => 'Pendidikan',
        };
    }
}
