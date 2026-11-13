import { Link, usePage } from '@inertiajs/react';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { SiteLogo, siteNavItems } from '@/components/site/site-header';
import { SocialLinks } from '@/components/site/social-links';
import { Separator } from '@/components/ui/separator';
import { create as consultationCreate } from '@/routes/consultation';

export function SiteFooter() {
    const { company, name } = usePage().props;

    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
                <div className="flex flex-col gap-4">
                    <SiteLogo />
                    <p className="max-w-xs text-sm text-muted-foreground">
                        {company.tagline}
                    </p>
                    <SocialLinks />
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-sm font-semibold">Jelajahi</span>
                    {siteNavItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                            {item.title}
                        </Link>
                    ))}
                    <Link
                        href={consultationCreate()}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        Konsultasi Gratis
                    </Link>
                </div>

                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        Kontak
                    </span>
                    <a
                        href={`mailto:${company.contact.email}`}
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                    >
                        <MailIcon className="size-4" />
                        {company.contact.email}
                    </a>
                    <span className="flex items-center gap-2">
                        <PhoneIcon className="size-4" />
                        {company.contact.phone}
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPinIcon className="size-4" />
                        {company.contact.address}
                    </span>
                    {company.contact.business_hours && (
                        <span className="flex items-center gap-2">
                            <ClockIcon className="size-4" />
                            {company.contact.business_hours}
                        </span>
                    )}
                </div>
            </div>
            <Separator />
            <p className="mx-auto w-full max-w-7xl px-4 py-6 text-xs text-muted-foreground md:px-6">
                {company.footer_text ||
                    `© ${new Date().getFullYear()} ${name}. Semua hak dilindungi.`}
            </p>
        </footer>
    );
}
