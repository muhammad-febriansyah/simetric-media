<?php

namespace App\Enums\Concerns;

trait HasOptions
{
    /**
     * Get every case as a value/label pair for select inputs.
     *
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }

    /**
     * Get this case as a value/label pair.
     *
     * @return array{value: string, label: string}
     */
    public function toOption(): array
    {
        return ['value' => $this->value, 'label' => $this->label()];
    }
}
