<?php

namespace App\Http\Requests\Admin;

use App\Enums\OrganizationType;
use App\Http\Requests\Admin\Concerns\PreparesContentInput;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CaseStudyRequest extends FormRequest
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
     * Prepare the data for validation: derive the slug and drop empty repeatable rows.
     */
    protected function prepareForValidation(): void
    {
        $this->mergeSlugFrom('title');
        $this->mergeRichText(['challenge', 'assessment', 'recommendation', 'solution']);
        $this->mergeFilledRows('results', ['label', 'value']);
        $this->mergeFilledRows('key_insights', ['title', 'description']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:220', Rule::unique('case_studies', 'slug')->ignore($this->route('case_study'))],
            'client_name' => ['required', 'string', 'max:150'],
            'project_period' => ['nullable', 'string', 'max:50'],
            'organization_type' => ['nullable', Rule::enum(OrganizationType::class)],
            'industry_id' => ['nullable', 'integer', Rule::exists('industries', 'id')],
            'service_ids' => ['nullable', 'array'],
            'service_ids.*' => ['integer', Rule::exists('services', 'id')],
            'solution_ids' => ['nullable', 'array'],
            'solution_ids.*' => ['integer', Rule::exists('solutions', 'id')],
            'excerpt' => ['nullable', 'string', 'max:300'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_cover_image' => ['nullable', 'boolean'],
            'gallery_images' => ['nullable', 'array', 'max:10'],
            'gallery_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_image_ids' => ['nullable', 'array'],
            'remove_image_ids.*' => ['integer'],
            'image_captions' => ['nullable', 'array'],
            'image_captions.*' => ['nullable', 'string', 'max:200'],
            'image_sort_orders' => ['nullable', 'array'],
            'image_sort_orders.*' => ['nullable', 'integer', 'min:0'],
            'challenge' => ['required', 'string', 'max:10000'],
            'assessment' => ['nullable', 'string', 'max:10000'],
            'recommendation' => ['nullable', 'string', 'max:10000'],
            'solution' => ['required', 'string', 'max:10000'],
            'results' => ['nullable', 'array', 'max:6'],
            'results.*.label' => ['required', 'string', 'max:60'],
            'results.*.value' => ['required', 'string', 'max:60'],
            'key_insights' => ['nullable', 'array', 'max:6'],
            'key_insights.*.title' => ['required', 'string', 'max:150'],
            'key_insights.*.description' => ['nullable', 'string', 'max:1000'],
            'is_featured' => ['nullable', 'boolean'],
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
            'title' => 'Judul',
            'slug' => 'Slug',
            'client_name' => 'Nama klien',
            'project_period' => 'Periode proyek',
            'organization_type' => 'Tipe organisasi',
            'gallery_images' => 'Galeri',
            'gallery_images.*' => 'Gambar galeri',
            'key_insights.*.title' => 'Judul insight',
            'key_insights.*.description' => 'Deskripsi insight',
            'meta_title' => 'Meta title',
            'meta_description' => 'Meta description',
            'industry_id' => 'Industri',
            'service_ids' => 'Layanan',
            'solution_ids' => 'Solusi',
            'image_captions.*' => 'Caption gambar',
            'image_sort_orders.*' => 'Urutan gambar',
            'excerpt' => 'Ringkasan',
            'cover_image' => 'Gambar cover',
            'challenge' => 'Tantangan',
            'assessment' => 'Temuan assessment',
            'recommendation' => 'Rekomendasi',
            'solution' => 'Solusi',
            'results.*.label' => 'Label hasil',
            'results.*.value' => 'Nilai hasil',
            'sort_order' => 'Urutan',
        ];
    }
}
