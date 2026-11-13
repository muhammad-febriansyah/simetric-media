<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\PreparesContentInput;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndustryRequest extends FormRequest
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
        $this->mergeSlugFrom('name');
        $this->mergeLinesAsList('pain_points');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:120', Rule::unique('industries', 'slug')->ignore($this->route('industry'))],
            'summary' => ['nullable', 'string', 'max:1000'],
            'pain_points' => ['nullable', 'array', 'max:10'],
            'pain_points.*' => ['string', 'max:200'],
            'icon' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            ...$this->seoRules(),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'Nama industri',
            'slug' => 'Slug',
            'summary' => 'Ringkasan',
            'pain_points' => 'Masalah umum',
            'icon' => 'Ikon',
            'sort_order' => 'Urutan',
            'meta_title' => 'Meta title',
            'meta_description' => 'Meta description',
        ];
    }
}
