import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Bento grid (adapted from Magic UI "Bento Grid"). Cards span columns through
 * their `className`, e.g. `lg:col-span-2`.
 */
export function BentoGrid({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'grid w-full grid-cols-1 gap-4 sm:auto-rows-[17rem] lg:grid-cols-3',
                className,
            )}
        >
            {children}
        </div>
    );
}

type BentoCardProps = {
    name: string;
    description?: string | null;
    icon: ReactNode;
    href: NonNullable<InertiaLinkProps['href']>;
    cta: string;
    /** Decorative content filling the top of the card. */
    background?: ReactNode;
    className?: string;
};

/**
 * Card with optional decorative background; on hover the content lifts slightly
 * and the call to action nudges forward.
 */
export function BentoCard({
    name,
    description,
    icon,
    href,
    cta,
    background,
    className,
}: BentoCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                'group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-card ring-2 ring-transparent transition-shadow duration-200 hover:ring-primary focus-visible:ring-primary focus-visible:outline-none',
                className,
            )}
        >
            {background && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 hidden sm:block"
                >
                    {background}
                </div>
            )}
            <div className="relative z-10 flex transform-gpu flex-col gap-2 p-6 transition-transform duration-300 group-hover:-translate-y-1">
                <span className="mb-1 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    {icon}
                </span>
                <h3 className="text-xl font-semibold group-hover:text-primary">
                    {name}
                </h3>
                {description && (
                    <p className="max-w-lg text-sm text-muted-foreground sm:line-clamp-2">
                        {description}
                    </p>
                )}
                <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {cta}
                    <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
            </div>
            <div className="pointer-events-none absolute inset-0 transition-colors duration-300 group-hover:bg-primary/[0.02]" />
        </Link>
    );
}
