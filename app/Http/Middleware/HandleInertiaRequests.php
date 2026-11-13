<?php

namespace App\Http\Middleware;

use App\Enums\LeadStatus;
use App\Models\ConsultationRequest;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => fn (): ?string => SiteSetting::values()['site_name'],
            'site' => fn (): array => SiteSetting::fileUrls(),
            'company' => fn (): array => $this->companyData(),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'admin' => fn (): ?array => $this->adminData($request),
        ];
    }

    /**
     * Company profile shown on the public website, editable from the admin settings.
     *
     * @return array{tagline: string|null, footer_text: string|null, contact: array<string, string|null>, social: array<string, string|null>}
     */
    protected function companyData(): array
    {
        $settings = SiteSetting::values();

        return [
            'tagline' => $settings['tagline'],
            'footer_text' => $settings['footer_text'],
            'contact' => [
                'email' => $settings['contact_email'],
                'phone' => $settings['contact_phone'],
                'whatsapp' => $settings['contact_whatsapp'],
                'address' => $settings['contact_address'],
                'business_hours' => $settings['business_hours'],
                'maps_embed_url' => $settings['maps_embed_url'],
            ],
            'social' => [
                'linkedin' => $settings['social_linkedin'],
                'instagram' => $settings['social_instagram'],
                'youtube' => $settings['social_youtube'],
                'facebook' => $settings['social_facebook'],
                'x' => $settings['social_x'],
                'tiktok' => $settings['social_tiktok'],
            ],
        ];
    }

    /**
     * Notification bell and sidebar counters, shared only with admins.
     *
     * @return array{newLeadsCount: int, notifications: array{unreadCount: int, items: mixed}}|null
     */
    protected function adminData(Request $request): ?array
    {
        $user = $request->user();

        if (! $user?->is_admin) {
            return null;
        }

        return [
            'newLeadsCount' => ConsultationRequest::query()->where('status', LeadStatus::New)->count(),
            'notifications' => [
                'unreadCount' => $user->unreadNotifications()->count(),
                'items' => $user->notifications()->latest()->limit(15)->get()
                    ->map(fn (DatabaseNotification $notification): array => [
                        'id' => $notification->id,
                        'data' => $notification->data,
                        'read' => $notification->read_at !== null,
                        'created_at_human' => $notification->created_at?->locale('id')->diffForHumans(),
                    ]),
            ],
        ];
    }
}
