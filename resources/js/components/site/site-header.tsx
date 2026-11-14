import { Link, router, usePage } from '@inertiajs/react';
import {
    BoxIcon,
    BriefcaseBusinessIcon,
    Building2Icon,
    FolderKanbanIcon,
    MessagesSquareIcon,
    NewspaperIcon,
    RouteIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import {
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    MobileNavToggle,
    NavBody,
    Navbar,
    NavItems,
} from '@/components/ui/resizable-navbar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { home, howWeWork } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
import { index as expertisesIndex } from '@/routes/expertises';
import { index as industriesIndex } from '@/routes/industries';
import { index as insightsIndex } from '@/routes/insights';
import { index as productsIndex } from '@/routes/products';

export const siteNavItems = [
    { title: 'Cara Kami Bekerja', href: howWeWork(), icon: RouteIcon },
    { title: 'Keahlian', href: expertisesIndex(), icon: BriefcaseBusinessIcon },
    { title: 'Industri', href: industriesIndex(), icon: Building2Icon },
    { title: 'Studi Kasus', href: caseStudiesIndex(), icon: FolderKanbanIcon },
    { title: 'Produk', href: productsIndex(), icon: BoxIcon },
    { title: 'Insight', href: insightsIndex(), icon: NewspaperIcon },
];

export function SiteLogo() {
    const { name } = usePage().props;

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

/**
 * Public site header: a resizable navbar that shrinks into a floating pill on scroll.
 */
export function SiteHeader() {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const items = siteNavItems.map((item) => ({
        ...item,
        isActive: isCurrentOrParentUrl(item.href),
    }));

    useEffect(() => {
        const removeListener = router.on('navigate', () =>
            setIsMobileMenuOpen(false),
        );
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => {
            removeListener();
            window.removeEventListener('keydown', closeOnEscape);
        };
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
                        <Button
                            asChild
                            size="sm"
                            className="hidden sm:inline-flex"
                        >
                            <Link href={consultationCreate()}>
                                <MessagesSquareIcon data-icon="inline-start" />
                                Konsultasi
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

                <MobileNavMenu id={MOBILE_MENU_ID} isOpen={isMobileMenuOpen}>
                    <nav
                        aria-label="Menu utama"
                        className="flex flex-col gap-1"
                    >
                        {items.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-current={
                                    item.isActive ? 'page' : undefined
                                }
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                    item.isActive
                                        ? 'bg-accent text-primary'
                                        : 'text-foreground hover:bg-muted',
                                )}
                            >
                                <item.icon className="size-4" />
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                    <Button asChild className="mt-2">
                        <Link
                            href={consultationCreate()}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <MessagesSquareIcon data-icon="inline-start" />
                            Konsultasi Gratis
                        </Link>
                    </Button>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}
