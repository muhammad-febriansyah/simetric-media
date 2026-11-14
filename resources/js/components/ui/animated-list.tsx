import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';
import { Children, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

function AnimatedListItem({ children }: { children: ReactNode }) {
    return (
        <motion.div
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, originY: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 40 }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}

/**
 * Reveals its children one by one, newest on top, like incoming notifications
 * (adapted from Magic UI "Animated List"). Stops once every item is shown;
 * visitors who prefer reduced motion see the full list at once.
 */
export function AnimatedList({
    children,
    className,
    delay = 1200,
}: {
    children: ReactNode;
    className?: string;
    /** Time between items, in milliseconds. */
    delay?: number;
}) {
    const prefersReducedMotion = useReducedMotion();
    const items = Children.toArray(children) as ReactElement[];
    const [index, setIndex] = useState(0);
    const visibleCount = prefersReducedMotion ? items.length : index + 1;

    useEffect(() => {
        if (prefersReducedMotion || index >= items.length - 1) {
            return;
        }

        const timeout = window.setTimeout(
            () => setIndex((current) => current + 1),
            delay,
        );

        return () => window.clearTimeout(timeout);
    }, [index, delay, items.length, prefersReducedMotion]);

    return (
        <div className={cn('flex flex-col items-center gap-3', className)}>
            <AnimatePresence>
                {items
                    .slice(0, visibleCount)
                    .reverse()
                    .map((item) => (
                        <AnimatedListItem key={item.key}>{item}</AnimatedListItem>
                    ))}
            </AnimatePresence>
        </div>
    );
}
