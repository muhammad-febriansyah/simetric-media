import { CommandMenu } from '@/components/admin/command-menu';
import { NotificationSheet } from '@/components/admin/notification-sheet';
import { UserDropdown } from '@/components/admin/user-dropdown';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppSidebarHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6!" />
            <div className="min-w-0 flex-1 md:flex-none">
                <CommandMenu />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <NotificationSheet />
                <UserDropdown />
            </div>
        </header>
    );
}
