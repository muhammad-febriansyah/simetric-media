<?php

namespace App\Casts;

use App\Support\RichText;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Rich text column: stores HTML. Plain text written by seeders, factories or older
 * code is converted to paragraphs so every value can be rendered as HTML.
 *
 * @implements CastsAttributes<string|null, string|null>
 */
class RichTextHtml implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        return $value;
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        return RichText::fromPlainText($value);
    }
}
