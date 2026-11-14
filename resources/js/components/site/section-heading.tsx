import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
    eyebrow: string;
    title: string;
    description?: string;
    action?: ReactNode;
    align?: 'left' | 'center';
    /** White text for the navy band. */
    onDark?: boolean;
};

/**
 * Section title in the BuildWithAngga style: a green eyebrow, a bold title and
 * an optional description and action.
 */
export function SectionHeading({
    eyebrow,
    title,
    description,
    action,
    align = 'left',
    onDark = false,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
                align === 'center' &&
                    'items-center text-center md:flex-col md:items-center',
            )}
        >
            <div
                className={cn(
                    'flex max-w-2xl flex-col gap-2',
                    align === 'center' && 'items-center',
                )}
            >
                <span className="text-sm font-semibold text-success md:text-base">
                    {eyebrow}
                </span>
                <h2
                    className={cn(
                        'text-2xl leading-tight font-bold text-balance md:text-[2rem]',
                        onDark && 'text-white',
                    )}
                >
                    {title}
                </h2>
                {description && (
                    <p
                        className={cn(
                            'mt-1 leading-relaxed',
                            onDark ? 'text-white/70' : 'text-muted-foreground',
                        )}
                    >
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}
