import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BlurFade } from '@/components/ui/blur-fade';
import { DotPattern } from '@/components/ui/dot-pattern';
import type { BreadcrumbItem } from '@/types';

type SitePageHeaderProps = {
    breadcrumbs?: BreadcrumbItem[];
    /** Small green label above the title. */
    eyebrow?: string;
    title?: string;
    description?: string;
    /** Extra content under the description, e.g. buttons or badges. */
    children?: ReactNode;
};

/**
 * Landing-style header for inner public pages: breadcrumbs, a green eyebrow,
 * a large bold title and a description, with a faint dot pattern on the right.
 */
export function SitePageHeader({
    breadcrumbs = [],
    eyebrow,
    title,
    description,
    children,
}: SitePageHeaderProps) {
    return (
        <header className="relative isolate pt-6 pb-4 md:pt-10 md:pb-6">
            <DotPattern className="-z-10 hidden [mask-image:radial-gradient(ellipse_at_right,white_10%,transparent_65%)] lg:block" />
            <BlurFade className="flex flex-col gap-4">
                {breadcrumbs.length > 0 && (
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                )}
                {eyebrow && (
                    <span className="text-sm font-semibold text-success md:text-base">
                        {eyebrow}
                    </span>
                )}
                {title && (
                    <h1 className="max-w-4xl text-3xl leading-tight font-bold text-balance md:text-[2.75rem]">
                        {title}
                    </h1>
                )}
                {description && (
                    <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                        {description}
                    </p>
                )}
                {children}
            </BlurFade>
        </header>
    );
}
