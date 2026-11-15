import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/** Time each service stays highlighted before the next one, in milliseconds. */
const STEP_DURATION = 3200;

/**
 * Hero list of the main service lines on a vertical track. The highlight moves
 * down the list on its own, with a progress line filling toward the next item;
 * hovering an item selects it. Stays still for visitors who prefer reduced motion.
 */
export function HeroServiceLines({ items }: { items: string[] }) {
    const prefersReducedMotion = useReducedMotion();
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (prefersReducedMotion || items.length < 2) {
            return;
        }

        const timeout = window.setTimeout(
            () => setActive((current) => (current + 1) % items.length),
            STEP_DURATION,
        );

        return () => window.clearTimeout(timeout);
    }, [active, prefersReducedMotion, items.length]);

    return (
        <ol className="relative flex flex-col gap-12 pl-12 md:gap-16">
            <span
                aria-hidden="true"
                className="absolute top-4 bottom-4 left-[13px] w-0.5 rounded-full bg-primary/15"
            />
            {items.map((item, position) => {
                const isActive = position === active;
                const hasNext = position < items.length - 1;

                return (
                    <li
                        key={item}
                        onMouseEnter={() => setActive(position)}
                        className="relative"
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                'absolute top-1 -left-12 flex size-7 items-center justify-center rounded-full border-2 bg-background transition-colors duration-300',
                                isActive
                                    ? 'border-primary'
                                    : 'border-primary/30',
                            )}
                        >
                            {isActive && (
                                <span className="size-2.5 rounded-full bg-primary" />
                            )}
                        </span>
                        {isActive && hasNext && !prefersReducedMotion && (
                            <motion.span
                                key={active}
                                aria-hidden="true"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{
                                    duration: STEP_DURATION / 1000,
                                    ease: 'linear',
                                }}
                                className="absolute top-8 -bottom-13 -left-[35px] w-0.5 origin-top rounded-full bg-primary md:-bottom-17"
                            />
                        )}
                        <span className="block text-2xl leading-tight font-bold text-balance md:text-[2rem]">
                            {item}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
