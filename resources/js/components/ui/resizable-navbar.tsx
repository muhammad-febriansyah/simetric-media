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
import type { ReactElement, ReactNode } from 'react';
import { Children, cloneElement, isValidElement, useState } from 'react';
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
                width: visible ? '62%' : '100%',
                y: visible ? 12 : 0,
            }}
            transition={SPRING}
            style={{ minWidth: 960 }}
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
};

export function NavItems({
    items,
    className,
}: {
    items: NavItem[];
    className?: string;
}) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <nav
            aria-label="Menu utama"
            onMouseLeave={() => setHovered(null)}
            className={cn(
                'flex flex-1 items-center justify-center gap-1 text-sm font-medium',
                className,
            )}
        >
            {items.map((item, index) => (
                <Link
                    key={item.title}
                    href={item.href}
                    prefetch
                    onMouseEnter={() => setHovered(index)}
                    aria-current={item.isActive ? 'page' : undefined}
                    className={cn(
                        'relative rounded-full px-3.5 py-2 whitespace-nowrap transition-colors',
                        item.isActive
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {(hovered === index ||
                        (hovered === null && item.isActive)) && (
                        <motion.span
                            layoutId="navbar-pill"
                            transition={SPRING}
                            className="absolute inset-0 rounded-full bg-accent"
                        />
                    )}
                    <span className="relative z-10">{item.title}</span>
                </Link>
            ))}
        </nav>
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
