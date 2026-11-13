<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\PreparesContentInput;
use App\Models\Faq;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Foundation\Http\FormRequest;

class FaqRequest extends FormRequest
{
    use PreparesContentInput;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('access-admin') ?? false;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->mergeRichText(['answer']);
    }

    /**
     * Get the validation rules that apply to the request. The placement is
     * encoded as "page:{page}" or "{type}:{id}" (e.g. "service:3").
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'placement' => [
                'required',
                'string',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if ($this->placementAttributes() === null) {
                        $fail('Lokasi FAQ yang dipilih tidak valid.');
                    }
                },
            ],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string', 'max:5000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Decode the placement into the page or polymorphic owner columns.
     *
     * @return array{page: string|null, faqable_type: string|null, faqable_id: int|null}|null
     */
    public function placementAttributes(): ?array
    {
        [$type, $key] = array_pad(explode(':', (string) $this->input('placement'), 2), 2, null);

        if ($type === 'page') {
            return array_key_exists((string) $key, Faq::PAGES)
                ? ['page' => $key, 'faqable_type' => null, 'faqable_id' => null]
                : null;
        }

        $modelClass = in_array($type, ['service', 'industry', 'solution'], true) ? Relation::getMorphedModel($type) : null;

        if ($modelClass === null || ! ctype_digit((string) $key) || ! $modelClass::query()->whereKey((int) $key)->exists()) {
            return null;
        }

        return ['page' => null, 'faqable_type' => $type, 'faqable_id' => (int) $key];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'placement' => 'Lokasi tampil',
            'question' => 'Pertanyaan',
            'answer' => 'Jawaban',
            'sort_order' => 'Urutan',
        ];
    }
}
