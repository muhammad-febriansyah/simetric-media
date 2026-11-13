<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum BusinessFunction: string
{
    use HasOptions;

    case Operations = 'operations';
    case Sales = 'sales';
    case Finance = 'finance';
    case HumanResource = 'human_resource';
    case InformationTechnology = 'information_technology';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Operations => 'Operasional & Produksi',
            self::Sales => 'Penjualan & Pelanggan',
            self::Finance => 'Keuangan & Akuntansi',
            self::HumanResource => 'SDM',
            self::InformationTechnology => 'Sistem & Infrastruktur IT',
            self::Other => 'Lainnya',
        };
    }
}
