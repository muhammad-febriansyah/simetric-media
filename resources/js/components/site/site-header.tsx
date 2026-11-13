import { Link, usePage } from '@inertiajs/react';
import {
    BriefcaseBusinessIcon,
    Building2Icon,
    FolderKanbanIcon,
    MenuIcon,
    MessagesSquareIcon,
    RouteIcon,
} from 'lucide-react';
import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { home, howWeWork } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
import { index as industriesIndex } from '@/routes/industries';
import { index as servicesIndex } from '@/routes/services';

export const siteNavItems = [
    { title: 'Cara Kami Bekerja', href: howWeWork(), icon: RouteIcon },
    { title: 'Layanan', href: servicesIndex(), icon: BriefcaseBusinessIcon },
    { title: 'Industri', href: industriesIndex(), icon: Building2Icon },
    { title: 'Studi Kasus', href: caseStudiesIndex(), icon: FolderKanbanIcon },
];

export function SiteLogo() {
    const { name } = usePage().props;

    return (
        <Link href={home()} className="flex items-center gap-3">
            <BrandMark className="size-10" />
            <span className="text-lg font-semibold">{name}</span>
        </Link>
    );
}

export function SiteHeader() {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
            <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
                <SiteLogo />

                <nav
                    className="hidden items-center gap-1 lg:flex"
                    aria-label="Menu utama"
                >
                    {siteNavItems.map((item) => (
                        <Button
                            key={item.title}
                            variant="ghost"
                            size="sm"
                            asChild
                            className={cn(
                                isCurrentOrParentUrl(item.href) &&
                                    'bg-accent text-accent-foreground',
                            )}
                        >
                            <Link href={item.href} prefetch>
                                <item.icon data-icon="inline-start" />
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button asChild className="hidden sm:inline-flex">
                        <Link href={consultationCreate()}>
                            <MessagesSquareIcon data-icon="inline-start" />
                            Konsultasi Gratis
                        </Link>
                    </Button>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                            >
                                <MenuIcon />
                                <span className="sr-only">Buka menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Navigasi utama website
                                </SheetDescription>
                            </SheetHeader>
                            <nav className="flex flex-col gap-1 px-4">
                                {siteNavItems.map((item) => (
                                    <Button
                                        key={item.title}
                                        variant="ghost"
                                        asChild
                                        className={cn(
                                            'justify-start',
                                            isCurrentOrParentUrl(item.href) &&
                                                'bg-accent text-accent-foreground',
                                        )}
                                    >
                                        <Link href={item.href}>
                                            <item.icon data-icon="inline-start" />
                                            {item.title}
                                        </Link>
                                    </Button>
                                ))}
                                <Button asChild className="mt-4">
                                    <Link href={consultationCreate()}>
                                        <MessagesSquareIcon data-icon="inline-start" />
                                        Konsultasi Gratis
                                    </Link>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
