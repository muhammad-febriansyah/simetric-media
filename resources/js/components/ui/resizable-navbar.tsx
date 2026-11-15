import type { InertiaLinkProps } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { MenuIcon, XIcon } from 'lucide-react';
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useScroll,
} from 'motion/react';
import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { Children, cloneElement, isValidElement, useState } from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

/**
 * Resizable navbar (adapted from Aceternity UI): full width at the top of the page,
 * shrinking into a floating pill once the visitor scrolls down.
 */

const SCROLL_THRESHOLD = 80;

const FLOATING_SHADOW =
    'shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_16px_68px_rgba(47,48,55,0.05)]';

const SPRING = { type: 'spring', stiffness: 200, damping: 50 } as const;

type VisibleProps = { visible?: boolean };

export function Navbar({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) =>
        setVisible(latest > SCROLL_THRESHOLD),
    );

    return (
        <motion.header
            data-scrolled={visible}
            className={cn('fixed inset-x-0 top-0 z-40 w-full pt-3', className)}
        >
            {Children.map(children, (child) =>
                isValidElement(child)
                    ? cloneElement(child as ReactElement<VisibleProps>, {
                          visible,
                      })
                    : child,
            )}
        </motion.header>
    );
}

export function NavBody({
    children,
    className,
    visible,
}: {
    children: ReactNode;
    className?: string;
} & VisibleProps) {
    return (
        <motion.div
            animate={{
                width: visible ? '70%' : '100%',
                y: visible ? 12 : 0,
            }}
            transition={SPRING}
            style={{ minWidth: 1080 }}
            className={cn(
                'relative mx-auto hidden w-full max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2 transition-colors duration-300 xl:flex',
                visible
                    ? cn('bg-card/85 backdrop-blur-md', FLOATING_SHADOW)
                    : 'bg-transparent',
                className,
            )}
        >
            {children}
        </motion.div>
    );
}

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon;
    isActive?: boolean;
    /** Mega menu panel; when set, the item opens this panel instead of linking. */
    menu?: ReactNode;
};

/**
 * A mouse click on a trigger whose menu is already open (opened by hovering)
 * would toggle it shut; keep it open instead. Keyboard activation (detail 0)
 * still toggles normally.
 */
function keepHoverOpenMenu(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail > 0 && event.currentTarget.dataset.state === 'open') {
        event.preventDefault();
    }
}

const NAV_ITEM_CLASS =
    'relative h-auto rounded-full bg-transparent px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[active=true]:bg-transparent';

/**
 * Desktop navigation (Radix navigation menu): plain links plus mega menu
 * triggers that open their panel on hover, click or keyboard. A pill slides
 * behind the hovered item.
 */
export function NavItems({
    items,
    className,
}: {
    items: NavItem[];
    className?: string;
}) {
    const [hovered, setHovered] = useState<number | null>(null);

    const pill = (index: number, isActive?: boolean) =>
        (hovered === index || (hovered === null && isActive)) && (
            <motion.span
                layoutId="navbar-pill"
                transition={SPRING}
                className="absolute inset-0 rounded-full bg-accent"
            />
        );

    return (
        <NavigationMenu
            aria-label="Menu utama"
            onMouseLeave={() => setHovered(null)}
            viewportClassName="mt-3 rounded-2xl border-0 shadow-[0_20px_50px_-12px_rgba(52,54,74,0.25)]"
            className={cn('max-w-none flex-1', className)}
        >
            <NavigationMenuList className="gap-1">
                {items.map((item, index) => {
                    const colorClass = item.isActive
                        ? 'text-primary hover:text-primary focus:text-primary'
                        : 'text-muted-foreground hover:text-foreground focus:text-foreground data-[state=open]:text-foreground';

                    return (
                        <NavigationMenuItem
                            key={item.title}
                            onMouseEnter={() => setHovered(index)}
                        >
                            {item.menu ? (
                                <>
                                    <NavigationMenuTrigger
                                        onClick={keepHoverOpenMenu}
                                        className={cn(NAV_ITEM_CLASS, colorClass)}
                                    >
                                        {pill(index, item.isActive)}
                                        <span className="relative z-10">
                                            {item.title}
                                        </span>
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="p-0">
                                        {item.menu}
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                <NavigationMenuLink
                                    asChild
                                    active={item.isActive}
                                    className={cn(NAV_ITEM_CLASS, colorClass)}
                                >
                                    <Link
                                        href={item.href}
                                        prefetch
                                        aria-current={
                                            item.isActive ? 'page' : undefined
                                        }
                                    >
                                        {pill(index, item.isActive)}
                                        <span className="relative z-10">
                                            {item.title}
                                        </span>
                                    </Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export function MobileNav({
    children,
    className,
    visible,
}: {
    children: ReactNode;
    className?: string;
} & VisibleProps) {
    return (
        <motion.div
            animate={{
                width: visible ? '92%' : '100%',
                y: visible ? 8 : 0,
            }}
            transition={SPRING}
            className={cn(
                'relative mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-col rounded-2xl px-3 py-2 transition-colors duration-300 xl:hidden',
                visible
                    ? cn('bg-card/90 backdrop-blur-md', FLOATING_SHADOW)
                    : 'bg-transparent',
                className,
            )}
        >
            {children}
        </motion.div>
    );
}

export function MobileNavHeader({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex w-full items-center justify-between gap-3',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function MobileNavMenu({
    id,
    children,
    className,
    isOpen,
}: {
    id: string;
    children: ReactNode;
    className?: string;
    isOpen: boolean;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    id={id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        'absolute inset-x-0 top-full mt-2 flex w-full flex-col gap-1 rounded-2xl bg-card p-3',
                        FLOATING_SHADOW,
                        className,
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function MobileNavToggle({
    isOpen,
    controls,
    onClick,
}: {
    isOpen: boolean;
    controls: string;
    onClick: () => void;
}) {
    const Icon = isOpen ? XIcon : MenuIcon;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={isOpen}
            aria-controls={controls}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <Icon className="size-5" />
        </button>
    );
}
