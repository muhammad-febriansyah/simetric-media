import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { PageHeader } from '@/components/page-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    title,
    description,
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <AppSidebarHeader />
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
