<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

/**
 * Key/value website settings editable from the admin panel.
 * Empty values fall back to the config value listed in DEFAULTS (if any).
 *
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['key', 'value'])]
class SiteSetting extends Model
{
    private const CACHE_KEY = 'site_settings';

    /**
     * Editable settings mapped to their config fallback (null means no fallback).
     *
     * @var array<string, string|null>
     */
    public const DEFAULTS = [
        // General
        'site_name' => 'app.name',
        'tagline' => 'company.tagline',
        'footer_text' => null,
        'site_logo' => null,
        'site_favicon' => null,
        // Contact & location
        'contact_email' => 'company.contact.email',
        'contact_phone' => 'company.contact.phone',
        'contact_whatsapp' => 'company.contact.whatsapp',
        'contact_address' => 'company.contact.address',
        'business_hours' => null,
        'maps_embed_url' => null,
        // Social media
        'social_linkedin' => 'company.social.linkedin',
        'social_instagram' => 'company.social.instagram',
        'social_youtube' => 'company.social.youtube',
        'social_facebook' => null,
        'social_x' => null,
        'social_tiktok' => null,
        // SEO
        'seo_title' => null,
        'seo_description' => null,
        'seo_keywords' => null,
        'seo_og_image' => null,
        'google_analytics_id' => null,
        'google_site_verification' => null,
    ];

    /**
     * Settings that store a file path on the public disk.
     *
     * @var list<string>
     */
    public const FILE_KEYS = ['site_logo', 'site_favicon', 'seo_og_image'];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    /**
     * All settings with stored values overriding the config defaults.
     *
     * @return array<string, string|null>
     */
    public static function values(): array
    {
        $stored = Cache::rememberForever(
            self::CACHE_KEY,
            fn (): array => static::query()->pluck('value', 'key')->all(),
        );

        return collect(self::DEFAULTS)
            ->map(function (?string $configKey, string $key) use ($stored): ?string {
                if (filled($stored[$key] ?? null)) {
                    return $stored[$key];
                }

                return $configKey ? config($configKey) : null;
            })
            ->all();
    }

    /**
     * Public URLs of the uploaded files (logo, favicon, OG image).
     *
     * @return array<string, string|null>
     */
    public static function fileUrls(): array
    {
        $values = static::values();

        return collect(self::FILE_KEYS)
            ->mapWithKeys(fn (string $key): array => [
                $key.'_url' => filled($values[$key]) ? Storage::disk('public')->url($values[$key]) : null,
            ])
            ->all();
    }

    /**
     * Store several settings at once. Unknown keys are ignored.
     *
     * @param  array<string, string|null>  $values
     */
    public static function store(array $values): void
    {
        foreach ($values as $key => $value) {
            if (array_key_exists($key, self::DEFAULTS)) {
                static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }
    }
}
