<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\PreparesContentInput;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        $this->mergeFilledRows('features', ['title', 'description']);
        $this->mergeFilledRows('highlights', ['label', 'value']);
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
            'slug' => ['required', 'string', 'max:120', Rule::unique('products', 'slug')->ignore($this->route('product'))],
            'category' => ['nullable', 'string', 'max:60'],
            'tagline' => ['nullable', 'string', 'max:200'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'body' => ['nullable', 'string', 'max:20000'],
            'website_url' => ['nullable', 'url:http,https', 'max:255'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:1024'],
            'remove_logo' => ['nullable', 'boolean'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_cover_image' => ['nullable', 'boolean'],
            'features' => ['nullable', 'array', 'max:12'],
            'features.*.title' => ['required', 'string', 'max:100'],
            'features.*.description' => ['nullable', 'string', 'max:500'],
            'highlights' => ['nullable', 'array', 'max:4'],
            'highlights.*.label' => ['required', 'string', 'max:60'],
            'highlights.*.value' => ['required', 'string', 'max:30'],
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
            'name' => 'Nama produk',
            'slug' => 'Slug',
            'category' => 'Kategori',
            'tagline' => 'Tagline',
            'summary' => 'Ringkasan',
            'body' => 'Penjelasan detail',
            'website_url' => 'URL website',
            'logo' => 'Logo',
            'cover_image' => 'Gambar cover',
            'features.*.title' => 'Judul fitur',
            'features.*.description' => 'Deskripsi fitur',
            'highlights.*.label' => 'Label angka',
            'highlights.*.value' => 'Nilai angka',
            'sort_order' => 'Urutan',
            'meta_title' => 'Meta title',
            'meta_description' => 'Meta description',
        ];
    }
}
