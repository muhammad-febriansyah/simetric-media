import type { Auth } from '@/types/auth';
import type { AdminSharedData } from '@/types/admin';
import type { SiteNav } from '@/types/site-nav';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            admin: AdminSharedData | null;
            siteNav?: SiteNav;
            site: {
                site_logo_url: string | null;
                site_favicon_url: string | null;
                seo_og_image_url: string | null;
            };
            company: {
                tagline: string;
                footer_text: string | null;
                contact: {
                    email: string;
                    phone: string;
                    whatsapp: string;
                    address: string;
                    business_hours: string | null;
                    maps_embed_url: string | null;
                };
                social: {
                    linkedin: string | null;
                    instagram: string | null;
                    youtube: string | null;
                    facebook: string | null;
                    x: string | null;
                    tiktok: string | null;
                };
            };
            [key: string]: unknown;
        };
    }
}
