import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Cycles through a list of words in place (adapted from Magic UI "Word Rotate").
 * Screen readers get the full list once instead of the changing word, and the
 * rotation stops for visitors who prefer reduced motion.
 */
export function WordRotate({
    words,
    duration = 2600,
    className,
}: {
    words: string[];
    /** Time each word stays visible, in milliseconds. */
    duration?: number;
    className?: string;
}) {
    const prefersReducedMotion = useReducedMotion();
    const [index, setIndex] = useState(0);
    const canRotate = words.length > 1 && !prefersReducedMotion;

    useEffect(() => {
        if (!canRotate) {
            return;
        }

        const interval = window.setInterval(
            () => setIndex((current) => (current + 1) % words.length),
            duration,
        );

        return () => window.clearInterval(interval);
    }, [canRotate, duration, words.length]);

    if (words.length === 0) {
        return null;
    }

    return (
        <span className="relative inline-flex overflow-hidden align-bottom">
            <span className="sr-only">{words.join(', ')}</span>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={words[index]}
                    aria-hidden="true"
                    initial={{ opacity: 0, y: '-100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={cn('inline-block whitespace-nowrap', className)}
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
