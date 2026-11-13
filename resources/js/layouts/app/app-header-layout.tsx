import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs = [],
    title,
    description,
}: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeader />
            <AppContent variant="header">
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                    <PageHeader
                        breadcrumbs={breadcrumbs}
                        title={title}
                        description={description}
                    />
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
