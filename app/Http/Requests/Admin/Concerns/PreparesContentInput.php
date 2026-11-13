<?php

namespace App\Http\Requests\Admin\Concerns;

use Carbon\CarbonInterface;
use Illuminate\Support\Str;

/**
 * Shared input handling for admin content forms (slug, list fields, publication).
 */
trait PreparesContentInput
{
    /**
     * Use the given slug, or derive one from the source field when it is empty.
     */
    protected function mergeSlugFrom(string $sourceField): void
    {
        $this->merge([
            'slug' => Str::slug((string) ($this->input('slug') ?: $this->input($sourceField, ''))),
        ]);
    }

    /**
     * Turn a textarea value (one item per line) into a list of non-empty strings.
     */
    protected function mergeLinesAsList(string $field): void
    {
        $value = $this->input($field);

        if (is_string($value)) {
            $this->merge([
                $field => collect(preg_split('/\r\n|\r|\n/', $value))
                    ->map(fn (string $line): string => trim($line))
                    ->filter()
                    ->values()
                    ->all(),
            ]);
        }
    }

    /**
     * Drop rows of a repeatable field (e.g. capabilities) whose keys are all empty.
     *
     * @param  list<string>  $keys
     */
    protected function mergeFilledRows(string $field, array $keys): void
    {
        $rows = $this->input($field);

        if (! is_array($rows)) {
            return;
        }

        $this->merge([
            $field => collect($rows)
                ->filter(fn (mixed $row): bool => is_array($row) && collect($keys)->contains(fn (string $key): bool => filled($row[$key] ?? null)))
                ->values()
                ->all(),
        ]);
    }

    /**
     * Validation rules for the SEO meta fields.
     *
     * @return array<string, list<string>>
     */
    protected function seoRules(): array
    {
        return [
            'meta_title' => ['nullable', 'string', 'max:70'],
            'meta_description' => ['nullable', 'string', 'max:160'],
        ];
    }

    /**
     * Resolve the publication timestamp, keeping the original date when already published.
     */
    public function publishedAt(?CarbonInterface $currentPublishedAt = null): ?CarbonInterface
    {
        if (! $this->boolean('is_published')) {
            return null;
        }

        return $currentPublishedAt ?? now();
    }
}
