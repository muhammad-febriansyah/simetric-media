import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { CtaSection } from '@/components/site/cta-section';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { SitePageHeader } from '@/components/site/site-page-header';
import { WhatsappButton } from '@/components/site/whatsapp-button';
import type { BreadcrumbItem } from '@/types';

type SiteLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    /** Small green label above the page title. */
    eyebrow?: string;
    title?: string;
    description?: string;
    showCta?: boolean;
    /** Render the inner-page container even when the page renders its own header. */
    inner?: boolean;
};

/**
 * Public website layout. Inner pages pass breadcrumbs, title and description
 * (or `inner` when they render a dynamic SitePageHeader themselves); the home page
 * passes none and renders its own hero.
 */
export default function SiteLayout({
    children,
    breadcrumbs = [],
    eyebrow,
    title,
    description,
    showCta = true,
    inner = false,
}: SiteLayoutProps) {
    const isInnerPage = inner || Boolean(title);

    return (
        <MotionConfig reducedMotion="user">
            <div className="flex min-h-svh flex-col bg-background">
                <SiteHeader />
                <main className="flex flex-1 flex-col pt-20">
                    {isInnerPage ? (
                        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 md:px-6">
                            {(title || breadcrumbs.length > 0) && (
                                <SitePageHeader
                                    breadcrumbs={breadcrumbs}
                                    eyebrow={eyebrow}
                                    title={title}
                                    description={description}
                                />
                            )}
                            {children}
                        </div>
                    ) : (
                        children
                    )}
                </main>
                {showCta && <CtaSection />}
                <SiteFooter />
                <WhatsappButton />
            </div>
        </MotionConfig>
    );
}
