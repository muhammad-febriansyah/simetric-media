import { Link, usePage } from '@inertiajs/react';
import {
    ClockIcon,
    MailIcon,
    MapPinIcon,
    MessageCircleIcon,
    PhoneIcon,
} from 'lucide-react';
import { SiteLogo, siteNavItems } from '@/components/site/site-header';
import { SocialLinks } from '@/components/site/social-links';
import { whatsappUrl } from '@/lib/whatsapp';
import { create as consultationCreate } from '@/routes/consultation';

const LINK =
    'w-fit text-sm text-muted-foreground transition-colors hover:text-primary';

function FooterColumn({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3">
            <span className="text-base font-semibold">{title}</span>
            {children}
        </div>
    );
}

/**
 * Light multi-column footer (BuildWithAngga style): company profile, site
 * navigation, ways to start and contact details from the website settings.
 */
export function SiteFooter() {
    const { company, name } = usePage().props;
    const whatsappLink = whatsappUrl(company.contact.whatsapp);

    return (
        <footer className="border-t border-border/70">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
                <div className="flex flex-col gap-4">
                    <SiteLogo />
                    <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                        {company.tagline}
                    </p>
                    <SocialLinks />
                </div>

                <FooterColumn title="Jelajahi">
                    {siteNavItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={LINK}
                        >
                            {item.title}
                        </Link>
                    ))}
                </FooterColumn>

                <FooterColumn title="Mulai">
                    <Link href={consultationCreate()} className={LINK}>
                        Konsultasi Gratis
                    </Link>
                    {whatsappLink && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={LINK}
                        >
                            Chat WhatsApp
                        </a>
                    )}
                    <a
                        href={`mailto:${company.contact.email}`}
                        className={LINK}
                    >
                        Kirim email
                    </a>
                </FooterColumn>

                <FooterColumn title="Kontak">
                    <span className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                        {company.contact.address}
                    </span>
                    <a
                        href={`mailto:${company.contact.email}`}
                        className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        <MailIcon className="size-4 shrink-0" />
                        {company.contact.email}
                    </a>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PhoneIcon className="size-4 shrink-0" />
                        {company.contact.phone}
                    </span>
                    {whatsappLink && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                            <MessageCircleIcon className="size-4 shrink-0" />
                            WhatsApp
                        </a>
                    )}
                    {company.contact.business_hours && (
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ClockIcon className="size-4 shrink-0" />
                            {company.contact.business_hours}
                        </span>
                    )}
                </FooterColumn>
            </div>
            <div className="border-t border-border/70">
                <p className="mx-auto w-full max-w-7xl px-4 py-6 text-xs text-muted-foreground md:px-6">
                    {company.footer_text ||
                        `© ${new Date().getFullYear()} ${name}. Semua hak dilindungi.`}
                </p>
            </div>
        </footer>
    );
}
