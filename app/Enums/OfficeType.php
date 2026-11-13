<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum OfficeType: string
{
    use HasOptions;

    case Head = 'head';
    case Branch = 'branch';

    public function label(): string
    {
        return match ($this) {
            self::Head => 'Kantor pusat',
            self::Branch => 'Kantor cabang',
        };
    }
}
