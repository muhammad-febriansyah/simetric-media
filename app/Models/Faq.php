<?php

namespace App\Models;

use Database\Factories\FaqFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * A question and answer shown either on a static page (`page`) or on a
 * service, industry or solution detail page (`faqable`).
 *
 * @property int $id
 * @property string|null $faqable_type
 * @property int|null $faqable_id
 * @property string|null $page
 * @property string $question
 * @property string $answer
 * @property int $sort_order
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['faqable_type', 'faqable_id', 'page', 'question', 'answer', 'sort_order', 'is_active'])]
class Faq extends Model
{
    /** @use HasFactory<FaqFactory> */
    use HasFactory;

    /**
     * Static pages that can show FAQs, keyed by the stored `page` value.
     *
     * @var array<string, string>
     */
    public const PAGES = [
        'how-we-work' => 'Halaman Cara Kami Bekerja',
        'about' => 'Halaman Tentang',
        'consultation' => 'Halaman Konsultasi',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function faqable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Human-readable location where the FAQ is displayed.
     */
    public function placementLabel(): string
    {
        if ($this->page) {
            return self::PAGES[$this->page] ?? $this->page;
        }

        $prefix = match ($this->faqable_type) {
            'service' => 'Layanan',
            'industry' => 'Industri',
            'solution' => 'Solusi',
            default => '-',
        };

        return $prefix.': '.($this->faqable?->getAttribute('name') ?? '-');
    }

    /**
     * Encoded placement value used by the admin form, e.g. "page:about" or "service:3".
     */
    public function placementValue(): string
    {
        return $this->page ? 'page:'.$this->page : $this->faqable_type.':'.$this->faqable_id;
    }
}
