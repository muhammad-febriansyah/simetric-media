import { Breadcrumbs } from '@/components/breadcrumbs';
import type { BreadcrumbItem } from '@/types';

type PageHeaderProps = {
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
};

export function PageHeader({
    breadcrumbs = [],
    title,
    description,
}: PageHeaderProps) {
    if (breadcrumbs.length === 0 && !title && !description) {
        return null;
    }

    return (
        <header className="flex flex-col gap-3">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            {(title || description) && (
                <div className="flex flex-col gap-1">
                    {title && (
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                    )}
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            )}
        </header>
    );
}
