import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
    eyebrow: string;
    title: string;
    description?: string;
    action?: ReactNode;
    align?: 'left' | 'center';
};

export function SectionHeading({
    eyebrow,
    title,
    description,
    action,
    align = 'left',
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
                align === 'center' &&
                    'items-center text-center md:flex-col md:items-center',
            )}
        >
            <div className="flex max-w-2xl flex-col gap-3">
                <span className="text-sm font-semibold text-success">
                    {eyebrow}
                </span>
                <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
                {description && (
                    <p className="text-muted-foreground">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}
