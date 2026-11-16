import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ContentIcon } from '@/components/site/content-icon';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { index as expertisesIndex } from '@/routes/expertises';
import {
    index as industriesIndex,
    show as showIndustry,
} from '@/routes/industries';
import { show as showService } from '@/routes/services';
import type { SiteNavExpertise, SiteNavIndustry } from '@/types/site-nav';

/** A link inside a mega menu panel; closes the menu when followed. */
function MenuLink({
    href,
    className,
    children,
}: {
    href: NonNullable<InertiaLinkProps['href']>;
    className?: string;
    children: ReactNode;
}) {
    return (
        <NavigationMenuLink asChild className={className}>
            <Link href={href} prefetch>
                {children}
            </Link>
        </NavigationMenuLink>
    );
}

function PanelFooter({
    href,
    label,
    note,
}: {
    href: NonNullable<InertiaLinkProps['href']>;
    label: string;
    note: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-b-2xl bg-muted/60 px-6 py-4">
            <span className="text-sm text-muted-foreground">{note}</span>
            <MenuLink
                href={href}
                className="flex-row items-center gap-1.5 rounded-full p-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary focus:bg-transparent"
            >
                {label}
                <ArrowRightIcon className="size-4 text-primary" />
            </MenuLink>
        </div>
    );
}

/** Shared panel width: wide enough for four columns, never wider than the screen. */
const PANEL_WIDTH = 'w-[min(60rem,calc(100vw-4rem))]';

/**
 * Keahlian mega menu: one column per published expertise area, with its
 * services listed underneath.
 */
export function ExpertiseMegaMenu({
    expertises,
}: {
    expertises: SiteNavExpertise[];
}) {
    return (
        <div className={PANEL_WIDTH}>
            <div className="grid grid-cols-4 gap-4 p-5">
                {expertises.map((expertise) => (
                    <div key={expertise.id} className="flex flex-col gap-2">
                        <MenuLink
                            href={`${expertisesIndex.url()}#${expertise.slug}`}
                            className="flex-row items-center gap-2.5 rounded-xl p-2 hover:bg-accent"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <ContentIcon
                                    iconName={expertise.icon}
                                    className="size-[18px] text-accent-foreground"
                                />
                            </span>
                            <span className="text-sm font-bold text-foreground">
                                {expertise.name}
                            </span>
                        </MenuLink>
                        <ul className="ml-[1.6rem] flex flex-col gap-0.5 border-l-2 border-accent pl-2">
                            {expertise.services.map((service) => (
                                <li key={service.id}>
                                    <MenuLink
                                        href={showService(service.slug)}
                                        className="gap-0.5 rounded-lg px-2 py-1.5 hover:bg-muted"
                                    >
                                        <span className="text-sm font-medium text-foreground">
                                            {service.name}
                                        </span>
                                        {service.headline && (
                                            <span className="line-clamp-2 text-xs text-muted-foreground">
                                                {service.headline}
                                            </span>
                                        )}
                                    </MenuLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <PanelFooter
                href={expertisesIndex()}
                label="Semua keahlian"
                note="Dari strategi sampai pendampingan setelah aplikasi berjalan."
            />
        </div>
    );
}

/**
 * Industri mega menu: a compact four-column grid of published industries,
 * so even a long list fits without scrolling.
 */
export function IndustryMegaMenu({
    industries,
}: {
    industries: SiteNavIndustry[];
}) {
    return (
        <div className={PANEL_WIDTH}>
            <ul className="grid grid-cols-4 gap-1 p-4">
                {industries.map((industry) => (
                    <li key={industry.id}>
                        <MenuLink
                            href={showIndustry(industry.slug)}
                            className="h-full flex-row items-center gap-2.5 rounded-xl p-2.5 hover:bg-accent"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <ContentIcon
                                    iconName={industry.icon}
                                    className="size-[18px] text-accent-foreground"
                                />
                            </span>
                            <span className="text-sm leading-snug font-semibold text-foreground">
                                {industry.name}
                            </span>
                        </MenuLink>
                    </li>
                ))}
            </ul>
            <PanelFooter
                href={industriesIndex()}
                label="Semua industri"
                note="Kami mulai dengan memahami cara kerja bisnis Anda."
            />
        </div>
    );
}
