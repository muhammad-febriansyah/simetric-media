<?php

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
    Storage::fake('public');
});

/**
 * @return array<string, mixed>
 */
function validSiteSettings(array $overrides = []): array
{
    return [
        'site_name' => 'Simetric Media',
        'tagline' => 'Konsultan teknologi A sampai Z.',
        'contact_email' => 'halo@perusahaan.test',
        'contact_phone' => '021-1234567',
        'contact_whatsapp' => '6281234567890',
        'contact_address' => 'Bandung, Indonesia',
        'expertise_page_title' => 'Keahlian Kami',
        'expertise_page_description' => 'Kami mendampingi bisnis Anda dari A sampai Z.',
        ...$overrides,
    ];
}

test('falls back to the config values before anything is saved', function () {
    $this->get(route('admin.site-settings.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings/website')
            ->where('settings.tagline', config('company.tagline'))
            ->where('settings.site_name', config('app.name'))
            ->where('settings.site_logo_url', null)
        );
});

test('saves the settings and shares them with the website', function () {
    $this->put(route('admin.site-settings.update'), validSiteSettings([
        'business_hours' => 'Senin–Jumat, 09.00–17.00',
        'social_facebook' => 'https://www.facebook.com/simetric',
    ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.site-settings.edit'));

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('name', 'Simetric Media')
            ->where('company.contact.address', 'Bandung, Indonesia')
            ->where('company.contact.business_hours', 'Senin–Jumat, 09.00–17.00')
            ->where('company.social.facebook', 'https://www.facebook.com/simetric')
        );
});

test('uploads a logo and favicon and shares their URLs', function () {
    $this->put(route('admin.site-settings.update'), validSiteSettings([
        'site_logo' => UploadedFile::fake()->image('logo.png'),
        'site_favicon' => UploadedFile::fake()->image('favicon.png', 64, 64),
    ]))->assertSessionHasNoErrors();

    $values = SiteSetting::values();

    Storage::disk('public')->assertExists($values['site_logo']);
    Storage::disk('public')->assertExists($values['site_favicon']);

    $this->get(route('home'))
        ->assertSee(Storage::disk('public')->url($values['site_favicon']), false)
        ->assertInertia(fn (Assert $page) => $page
            ->where('site.site_logo_url', Storage::disk('public')->url($values['site_logo']))
        );
});

test('keeps the logo when no new file is uploaded and removes it on request', function () {
    $this->put(route('admin.site-settings.update'), validSiteSettings([
        'site_logo' => UploadedFile::fake()->image('logo.png'),
    ]));
    $logo = SiteSetting::values()['site_logo'];

    $this->put(route('admin.site-settings.update'), validSiteSettings())->assertSessionHasNoErrors();
    expect(SiteSetting::values()['site_logo'])->toBe($logo);

    $this->put(route('admin.site-settings.update'), validSiteSettings(['remove_site_logo' => '1']))
        ->assertSessionHasNoErrors();

    expect(SiteSetting::values()['site_logo'])->toBeNull();
    Storage::disk('public')->assertMissing($logo);
});

test('extracts the map URL from a pasted iframe embed code', function () {
    $iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!abc&amp;x=1" width="600" height="450"></iframe>';

    $this->put(route('admin.site-settings.update'), validSiteSettings(['maps_embed_url' => $iframe]))
        ->assertSessionHasNoErrors();

    expect(SiteSetting::values()['maps_embed_url'])->toBe('https://www.google.com/maps/embed?pb=!1m18!abc&x=1');
});

test('rejects invalid map links, WhatsApp numbers and Analytics IDs', function (string $field, string $value, string $message) {
    $this->put(route('admin.site-settings.update'), validSiteSettings([$field => $value]))
        ->assertSessionHasErrors([$field => $message]);
})->with([
    'non-Google map' => ['maps_embed_url', 'https://example.com/map', 'Gunakan link embed dari Google Maps (Bagikan → Sematkan peta).'],
    'local WhatsApp number' => ['contact_whatsapp', '081234567890', 'Nomor WhatsApp diawali 62 tanpa spasi, contoh 6281234567890.'],
    'old Analytics ID' => ['google_analytics_id', 'UA-12345-1', 'Format ID Google Analytics: G-XXXXXXXXXX.'],
]);

test('renders the SEO defaults and Analytics tag in the page head', function () {
    $this->put(route('admin.site-settings.update'), validSiteSettings([
        'seo_title' => 'Konsultan Teknologi Indonesia',
        'seo_description' => 'Pendamping transformasi digital perusahaan.',
        'google_analytics_id' => 'G-ABC1234567',
        'google_site_verification' => 'verif-code_123',
    ]))->assertSessionHasNoErrors();

    $this->get(route('home'))
        ->assertSee('<meta name="description" content="Pendamping transformasi digital perusahaan.">', false)
        ->assertSee('<meta property="og:title" content="Konsultan Teknologi Indonesia">', false)
        ->assertSee('<meta name="google-site-verification" content="verif-code_123">', false)
        ->assertSee('googletagmanager.com/gtag/js?id=G-ABC1234567', false);
});
