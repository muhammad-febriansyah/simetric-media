<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum CompanySize: string
{
    use HasOptions;

    case Micro = '1-10';
    case Small = '11-50';
    case Medium = '51-200';
    case Large = '201-1000';
    case Enterprise = '1000+';

    public function label(): string
    {
        return $this->value.' karyawan';
    }
}
