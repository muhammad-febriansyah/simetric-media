<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\PreparesContentInput;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
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
        $this->mergeRichText(['body']);
        $this->mergeFilledRows('capabilities', ['title', 'description']);
        $this->mergeFilledRows('methodology', ['title', 'description']);
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
            'slug' => ['required', 'string', 'max:170', Rule::unique('services', 'slug')->ignore($this->route('service'))],
            'expertise_id' => ['required', 'integer', Rule::exists('expertises', 'id')],
            'headline' => ['nullable', 'string', 'max:200'],
            'problem_statement' => ['nullable', 'string', 'max:2000'],
            'body' => ['nullable', 'string', 'max:20000'],
            'capabilities' => ['nullable', 'array', 'max:12'],
            'capabilities.*.title' => ['required', 'string', 'max:100'],
            'capabilities.*.description' => ['nullable', 'string', 'max:500'],
            'methodology' => ['nullable', 'array', 'max:10'],
            'methodology.*.title' => ['required', 'string', 'max:100'],
            'methodology.*.description' => ['nullable', 'string', 'max:500'],
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
            'name' => 'Nama layanan',
            'slug' => 'Slug',
            'expertise_id' => 'Bidang keahlian',
            'headline' => 'Headline',
            'problem_statement' => 'Masalah yang diselesaikan',
            'body' => 'Penjelasan detail',
            'capabilities.*.title' => 'Judul kemampuan',
            'capabilities.*.description' => 'Deskripsi kemampuan',
            'methodology.*.title' => 'Judul tahap metodologi',
            'methodology.*.description' => 'Deskripsi tahap metodologi',
            'meta_title' => 'Meta title',
            'meta_description' => 'Meta description',
            'icon' => 'Ikon',
            'sort_order' => 'Urutan',
        ];
    }
}
