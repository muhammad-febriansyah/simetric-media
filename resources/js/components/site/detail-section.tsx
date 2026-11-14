import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A titled block on a public detail page: green eyebrow, bold title and an
 * optional description above its content.
 */
export function DetailSection({
    eyebrow,
    title,
    description,
    action,
    children,
    className,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={cn('flex flex-col gap-6 pt-6', className)}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex max-w-2xl flex-col gap-2">
                    {eyebrow && (
                        <span className="text-sm font-semibold text-success">
                            {eyebrow}
                        </span>
                    )}
                    <h2 className="text-2xl leading-tight font-bold md:text-[1.75rem]">
                        {title}
                    </h2>
                    {description && (
                        <p className="leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}
