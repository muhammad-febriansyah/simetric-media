<?php

namespace App\Http\Requests\Admin;

use App\Enums\BusinessFunction;
use App\Http\Requests\Admin\Concerns\PreparesContentInput;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SolutionRequest extends FormRequest
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
        $this->mergeFilledRows('features', ['title', 'description']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:170', Rule::unique('solutions', 'slug')->ignore($this->route('solution'))],
            'business_function' => ['required', Rule::enum(BusinessFunction::class)],
            'headline' => ['nullable', 'string', 'max:200'],
            'problem_statement' => ['nullable', 'string', 'max:2000'],
            'body' => ['nullable', 'string', 'max:20000'],
            'features' => ['nullable', 'array', 'max:12'],
            'features.*.title' => ['required', 'string', 'max:100'],
            'features.*.description' => ['nullable', 'string', 'max:500'],
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
            'name' => 'Nama solusi',
            'slug' => 'Slug',
            'business_function' => 'Divisi bisnis',
            'headline' => 'Headline',
            'problem_statement' => 'Masalah yang diselesaikan',
            'body' => 'Penjelasan detail',
            'features.*.title' => 'Judul fitur',
            'features.*.description' => 'Deskripsi fitur',
            'sort_order' => 'Urutan',
            'meta_title' => 'Meta title',
            'meta_description' => 'Meta description',
        ];
    }
}
