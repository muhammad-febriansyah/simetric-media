<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClientLogoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('access-admin') ?? false;
    }

    /**
     * Get the validation rules that apply to the request. A logo file is required when creating.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'industry_id' => ['nullable', 'integer', Rule::exists('industries', 'id')],
            'product_id' => ['nullable', 'integer', Rule::exists('products', 'id')],
            'logo' => [$this->route('client_logo') ? 'nullable' : 'required', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:1024'],
            'website_url' => ['nullable', 'url', 'max:255'],
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
            'name' => 'Nama klien',
            'industry_id' => 'Industri',
            'product_id' => 'Produk',
            'logo' => 'Logo',
            'website_url' => 'Website',
            'sort_order' => 'Urutan',
        ];
    }
}
