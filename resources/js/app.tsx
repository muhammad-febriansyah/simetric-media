import { createInertiaApp, router } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import SiteLayout from '@/layouts/site-layout';
import { syncFavicon } from '@/lib/favicon';

const fallbackAppName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Site name set in the admin website settings (rendered into the root view).
 */
function siteName(): string {
    return (
        document.querySelector<HTMLMetaElement>('meta[name="application-name"]')
            ?.content || fallbackAppName
    );
}

void createInertiaApp({
    title: (title) => (title ? `${title} - ${siteName()}` : siteName()),
    layout: (name) => {
        switch (true) {
            case name.startsWith('site/'):
                return SiteLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#2547F9',
    },
});

// Keep the tab icon in step with the favicon from the website settings.
router.on('success', (event) => {
    syncFavicon(event.detail.page.props.site?.site_favicon_url);
});
