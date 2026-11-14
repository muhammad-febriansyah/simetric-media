import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

export type HoverEffectItem = {
    key: string | number;
    href: NonNullable<InertiaLinkProps['href']>;
    content: ReactNode;
};

/**
 * Grid of link cards with a soft highlight that slides to the hovered card
 * (adapted from Aceternity UI "Card Hover Effect").
 */
export function HoverEffect({
    items,
    className,
}: {
    items: HoverEffectItem[];
    className?: string;
}) {
    const layoutId = useId();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className={cn('grid sm:grid-cols-2 lg:grid-cols-3', className)}>
            {items.map((item, index) => (
                <Link
                    key={item.key}
                    href={item.href}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group relative block h-full p-2 focus-visible:outline-none"
                >
                    <AnimatePresence>
                        {hoveredIndex === index && (
                            <motion.span
                                layoutId={layoutId}
                                className="absolute inset-0 block rounded-3xl bg-primary/[0.07]"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <div className="site-card relative z-10 h-full p-5 group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50">
                        {item.content}
                    </div>
                </Link>
            ))}
        </div>
    );
}
