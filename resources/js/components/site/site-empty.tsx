import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

/**
 * Empty state inside a white public card.
 */
export function SiteEmpty({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon?: LucideIcon;
    title: string;
    description: string;
    children?: ReactNode;
}) {
    return (
        <div className="site-card p-6">
            <Empty>
                <EmptyHeader>
                    {Icon && (
                        <EmptyMedia variant="icon">
                            <Icon />
                        </EmptyMedia>
                    )}
                    <EmptyTitle>{title}</EmptyTitle>
                    <EmptyDescription>{description}</EmptyDescription>
                </EmptyHeader>
                {children && <EmptyContent>{children}</EmptyContent>}
            </Empty>
        </div>
    );
}
