<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SiteSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('access-admin') ?? false;
    }

    /**
     * Accept a full Google Maps <iframe> embed code and keep only its src URL.
     */
    protected function prepareForValidation(): void
    {
        $maps = trim((string) $this->input('maps_embed_url'));

        if (preg_match('/src=["\']([^"\']+)["\']/i', $maps, $matches)) {
            $maps = html_entity_decode($matches[1]);
        }

        $this->merge(['maps_embed_url' => $maps !== '' ? $maps : null]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'site_name' => ['required', 'string', 'max:60'],
            'tagline' => ['required', 'string', 'max:200'],
            'footer_text' => ['nullable', 'string', 'max:200'],
            'site_logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:1024'],
            'remove_site_logo' => ['nullable', 'boolean'],
            'site_favicon' => ['nullable', 'file', 'mimes:png,ico,svg', 'max:512'],
            'remove_site_favicon' => ['nullable', 'boolean'],

            'contact_email' => ['required', 'email', 'max:150'],
            'contact_phone' => ['required', 'string', 'max:30'],
            'contact_whatsapp' => ['required', 'string', 'regex:/^62[0-9]{8,14}$/'],
            'contact_address' => ['required', 'string', 'max:255'],
            'business_hours' => ['nullable', 'string', 'max:100'],
            'maps_embed_url' => ['nullable', 'url', 'max:2000', 'starts_with:https://www.google.com/maps/embed,https://maps.google.com/maps'],

            'social_linkedin' => ['nullable', 'url', 'max:255'],
            'social_instagram' => ['nullable', 'url', 'max:255'],
            'social_youtube' => ['nullable', 'url', 'max:255'],
            'social_facebook' => ['nullable', 'url', 'max:255'],
            'social_x' => ['nullable', 'url', 'max:255'],
            'social_tiktok' => ['nullable', 'url', 'max:255'],

            'seo_title' => ['nullable', 'string', 'max:70'],
            'seo_description' => ['nullable', 'string', 'max:160'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'seo_og_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_seo_og_image' => ['nullable', 'boolean'],
            'google_analytics_id' => ['nullable', 'string', 'regex:/^G-[A-Z0-9]{4,12}$/'],
            'google_site_verification' => ['nullable', 'string', 'max:100', 'regex:/^[A-Za-z0-9_\-]+$/'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'contact_whatsapp.regex' => 'Nomor WhatsApp diawali 62 tanpa spasi, contoh 6281234567890.',
            'maps_embed_url.starts_with' => 'Gunakan link embed dari Google Maps (Bagikan → Sematkan peta).',
            'google_analytics_id.regex' => 'Format ID Google Analytics: G-XXXXXXXXXX.',
            'google_site_verification.regex' => 'Masukkan kode verifikasi saja, bukan tag HTML lengkap.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'site_name' => 'Nama website',
            'tagline' => 'Tagline',
            'footer_text' => 'Teks footer',
            'site_logo' => 'Logo',
            'site_favicon' => 'Favicon',
            'contact_email' => 'Email kontak',
            'contact_phone' => 'Telepon',
            'contact_whatsapp' => 'Nomor WhatsApp',
            'contact_address' => 'Alamat singkat',
            'business_hours' => 'Jam operasional',
            'maps_embed_url' => 'Google Maps embed',
            'social_linkedin' => 'LinkedIn',
            'social_instagram' => 'Instagram',
            'social_youtube' => 'YouTube',
            'social_facebook' => 'Facebook',
            'social_x' => 'X (Twitter)',
            'social_tiktok' => 'TikTok',
            'seo_title' => 'Judul SEO default',
            'seo_description' => 'Deskripsi SEO default',
            'seo_keywords' => 'Kata kunci',
            'seo_og_image' => 'Gambar share (OG image)',
            'google_analytics_id' => 'ID Google Analytics',
            'google_site_verification' => 'Kode verifikasi Google Search Console',
        ];
    }
}
