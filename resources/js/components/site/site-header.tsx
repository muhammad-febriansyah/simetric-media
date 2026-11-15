import { Link, router, usePage } from '@inertiajs/react';
import {
    BoxIcon,
    BriefcaseBusinessIcon,
    Building2Icon,
    ChevronDownIcon,
    FolderKanbanIcon,
    HomeIcon,
    MessageCircleIcon,
    MessagesSquareIcon,
    NewspaperIcon,
    RouteIcon,
    XIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { BrandMark } from '@/components/brand-mark';
import {
    ExpertiseMegaMenu,
    IndustryMegaMenu,
} from '@/components/site/nav-mega-menu';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    MobileNav,
    MobileNavHeader,
    MobileNavToggle,
    NavBody,
    Navbar,
    NavItems,
} from '@/components/ui/resizable-navbar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { whatsappUrl } from '@/lib/whatsapp';
import { home, howWeWork } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
import { index as expertisesIndex } from '@/routes/expertises';
import {
    index as industriesIndex,
    show as showIndustry,
} from '@/routes/industries';
import { index as insightsIndex } from '@/routes/insights';
import { index as productsIndex } from '@/routes/products';

export const siteNavItems = [
    { title: 'Beranda', href: home(), icon: HomeIcon },
    { title: 'Cara Kami Bekerja', href: howWeWork(), icon: RouteIcon },
    { title: 'Keahlian', href: expertisesIndex(), icon: BriefcaseBusinessIcon },
    { title: 'Industri', href: industriesIndex(), icon: Building2Icon },
    { title: 'Studi Kasus', href: caseStudiesIndex(), icon: FolderKanbanIcon },
    { title: 'Produk', href: productsIndex(), icon: BoxIcon },
    { title: 'Insight', href: insightsIndex(), icon: NewspaperIcon },
];

/**
 * Site logo linking home: the uploaded logo on its own when one is set,
 * otherwise the default mark with the website name.
 */
export function SiteLogo() {
    const { name, site } = usePage().props;

    if (site.site_logo_url) {
        return (
            <Link
                href={home()}
                aria-label={name}
                className="flex shrink-0 items-center"
            >
                <img
                    src={site.site_logo_url}
                    alt={name}
                    className="h-11 w-auto max-w-[12rem] object-contain object-left md:h-14 md:max-w-[15rem]"
                />
            </Link>
        );
    }

    return (
        <Link href={home()} className="flex shrink-0 items-center gap-3">
            <BrandMark className="size-10" />
            <span className="text-lg font-semibold whitespace-nowrap">
                {name}
            </span>
        </Link>
    );
}

const MOBILE_MENU_ID = 'site-mobile-menu';

type SubLink = { title: string; href: string };

/**
 * Public site header: a resizable navbar that shrinks into a floating pill on scroll.
 */
export function SiteHeader() {
    const { siteNav, company } = usePage().props;
    const whatsappLink = whatsappUrl(company.contact.whatsapp);
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
    const expertises = siteNav?.expertises ?? [];
    const industries = siteNav?.industries ?? [];

    /** Mega menu panel (desktop) and sub-links (mobile) per menu item. */
    const groups: Record<string, { menu: ReactNode; links: SubLink[] }> = {
        Keahlian: {
            menu:
                expertises.length > 0 ? (
                    <ExpertiseMegaMenu expertises={expertises} />
                ) : null,
            links: expertises.map((expertise) => ({
                title: expertise.name,
                href: `${expertisesIndex.url()}#${expertise.slug}`,
            })),
        },
        Industri: {
            menu:
                industries.length > 0 ? (
                    <IndustryMegaMenu industries={industries} />
                ) : null,
            links: industries.map((industry) => ({
                title: industry.name,
                href: showIndustry.url(industry.slug),
            })),
        },
    };

    const items = siteNavItems.map((item) => ({
        ...item,
        // Every path starts with "/", so the home item only matches exactly.
        isActive:
            item.href === siteNavItems[0].href
                ? isCurrentUrl(item.href)
                : isCurrentOrParentUrl(item.href),
        menu: groups[item.title]?.menu ?? undefined,
        subLinks: groups[item.title]?.links ?? [],
    }));

    useEffect(() => {
        const removeListener = router.on('navigate', () =>
            setIsMobileMenuOpen(false),
        );
        return () => removeListener();
    }, []);

    return (
        <Navbar>
            <NavBody>
                <SiteLogo />
                <NavItems items={items} />
                <Button asChild>
                    <Link href={consultationCreate()}>
                        <MessagesSquareIcon data-icon="inline-start" />
                        Konsultasi Gratis
                    </Link>
                </Button>
            </NavBody>

            <MobileNav>
                <MobileNavHeader>
                    <SiteLogo />
                    <div className="flex items-center gap-2">
                        <Button asChild className="hidden sm:inline-flex">
                            <Link href={consultationCreate()}>
                                <MessagesSquareIcon data-icon="inline-start" />
                                Konsultasi Gratis
                            </Link>
                        </Button>
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            controls={MOBILE_MENU_ID}
                            onClick={() =>
                                setIsMobileMenuOpen((isOpen) => !isOpen)
                            }
                        />
                    </div>
                </MobileNavHeader>

                <Sheet
                    open={isMobileMenuOpen}
                    onOpenChange={setIsMobileMenuOpen}
                >
                    <SheetContent
                        id={MOBILE_MENU_ID}
                        side="right"
                        showCloseButton={false}
                        aria-describedby={undefined}
                        className="w-full gap-0 border-0 p-0 sm:max-w-sm xl:hidden"
                    >
                        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <SiteLogo />
                            <SheetClose asChild>
                                <button
                                    type="button"
                                    aria-label="Tutup menu"
                                    className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                >
                                    <XIcon className="size-5" />
                                </button>
                            </SheetClose>
                        </div>

                        <nav
                            aria-label="Menu utama"
                            className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
                        >
                            {items.map((item) => {
                                const isGroupOpen =
                                    openMobileGroup === item.title;
                                const subMenuId = `mobile-submenu-${item.title.toLowerCase()}`;

                                return (
                                    <div
                                        key={item.title}
                                        className="flex flex-col"
                                    >
                                        <div
                                            className={cn(
                                                'flex items-center gap-1 rounded-2xl transition-colors',
                                                item.isActive
                                                    ? 'bg-accent'
                                                    : 'hover:bg-muted',
                                            )}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                aria-current={
                                                    item.isActive
                                                        ? 'page'
                                                        : undefined
                                                }
                                                className={cn(
                                                    'flex flex-1 items-center gap-3 rounded-2xl px-2 py-2 text-base font-semibold',
                                                    item.isActive
                                                        ? 'text-primary'
                                                        : 'text-foreground',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'flex size-10 shrink-0 items-center justify-center rounded-xl',
                                                        item.isActive
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-accent text-accent-foreground',
                                                    )}
                                                >
                                                    <item.icon className="size-5" />
                                                </span>
                                                {item.title}
                                            </Link>
                                            {item.subLinks.length > 0 && (
                                                <button
                                                    type="button"
                                                    aria-expanded={isGroupOpen}
                                                    aria-controls={subMenuId}
                                                    aria-label={`${isGroupOpen ? 'Tutup' : 'Buka'} submenu ${item.title}`}
                                                    onClick={() =>
                                                        setOpenMobileGroup(
                                                            isGroupOpen
                                                                ? null
                                                                : item.title,
                                                        )
                                                    }
                                                    className="mr-1 flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-card hover:text-primary"
                                                >
                                                    <ChevronDownIcon
                                                        className={cn(
                                                            'size-5 transition-transform duration-200',
                                                            isGroupOpen &&
                                                                'rotate-180',
                                                        )}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                        {isGroupOpen && (
                                            <ul
                                                id={subMenuId}
                                                className="mt-1 mb-2 ml-[1.6rem] flex flex-col gap-0.5 border-l-2 border-accent pl-4"
                                            >
                                                {item.subLinks.map(
                                                    (subLink) => (
                                                        <li key={subLink.title}>
                                                            <Link
                                                                href={
                                                                    subLink.href
                                                                }
                                                                onClick={() =>
                                                                    setIsMobileMenuOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                            >
                                                                {subLink.title}
                                                            </Link>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="flex flex-col gap-3 border-t px-5 py-5">
                            <Button asChild size="lg">
                                <Link
                                    href={consultationCreate()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <MessagesSquareIcon data-icon="inline-start" />
                                    Konsultasi Gratis
                                </Link>
                            </Button>
                            {whatsappLink && (
                                <Button asChild size="lg" variant="secondary">
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircleIcon data-icon="inline-start" />
                                        Chat WhatsApp
                                    </a>
                                </Button>
                            )}
                            <p className="text-center text-xs text-muted-foreground">
                                {company.contact.email} ·{' '}
                                {company.contact.phone}
                            </p>
                        </div>
                    </SheetContent>
                </Sheet>
            </MobileNav>
        </Navbar>
    );
}
