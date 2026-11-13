import type { ReactNode } from 'react';
import { PageHeader } from '@/components/page-header';
import { CtaSection } from '@/components/site/cta-section';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import type { BreadcrumbItem } from '@/types';

type SiteLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
    showCta?: boolean;
    /** Render the inner-page container even when the page renders its own header. */
    inner?: boolean;
};

/**
 * Public website layout. Inner pages pass breadcrumbs, title and description
 * (or `inner` when they render a dynamic PageHeader themselves); the home page
 * passes none and renders its own hero.
 */
export default function SiteLayout({
    children,
    breadcrumbs = [],
    title,
    description,
    showCta = true,
    inner = false,
}: SiteLayoutProps) {
    const isInnerPage = inner || Boolean(title);

    return (
        <div className="flex min-h-svh flex-col bg-background">
            <SiteHeader />
            <main className="flex flex-1 flex-col">
                {isInnerPage ? (
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 md:px-6">
                        <PageHeader
                            breadcrumbs={breadcrumbs}
                            title={title}
                            description={description}
                        />
                        {children}
                    </div>
                ) : (
                    children
                )}
            </main>
            {showCta && <CtaSection />}
            <SiteFooter />
        </div>
    );
}
