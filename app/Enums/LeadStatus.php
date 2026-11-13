<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum LeadStatus: string
{
    use HasOptions;

    case New = 'new';
    case DiscoveryCall = 'discovery_call';
    case Assessment = 'assessment';
    case Proposal = 'proposal';
    case Won = 'won';
    case Lost = 'lost';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Baru',
            self::DiscoveryCall => 'Discovery Call',
            self::Assessment => 'Assessment',
            self::Proposal => 'Proposal',
            self::Won => 'Deal',
            self::Lost => 'Tidak Lanjut',
        };
    }
}
