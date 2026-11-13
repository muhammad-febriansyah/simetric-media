<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TestimonialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('access-admin') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'author_name' => ['required', 'string', 'max:100'],
            'author_position' => ['nullable', 'string', 'max:100'],
            'company' => ['nullable', 'string', 'max:150'],
            'case_study_id' => ['nullable', 'integer', Rule::exists('case_studies', 'id')],
            'product_id' => ['nullable', 'integer', Rule::exists('products', 'id')],
            'quote' => ['required', 'string', 'max:1000'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_photo' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'author_name' => 'Nama pemberi testimoni',
            'author_position' => 'Jabatan',
            'company' => 'Perusahaan',
            'case_study_id' => 'Studi kasus',
            'product_id' => 'Produk',
            'quote' => 'Testimoni',
            'photo' => 'Foto',
            'sort_order' => 'Urutan',
        ];
    }
}
