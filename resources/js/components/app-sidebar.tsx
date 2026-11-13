import { Link, usePage } from '@inertiajs/react';
import { ExternalLinkIcon } from 'lucide-react';
import { adminNavGroups } from '@/components/admin/admin-navigation';
import { BrandMark } from '@/components/brand-mark';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { dashboard, home } from '@/routes';

export function AppSidebar() {
    const { name, admin } = usePage().props;
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const newLeadsCount = admin?.newLeadsCount ?? 0;

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-transparent"
                        >
                            <Link href={dashboard()} prefetch>
                                <BrandMark />
                                <span className="flex flex-col leading-tight">
                                    <span className="truncate font-semibold">
                                        {name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Panel Admin
                                    </span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0 py-2">
                {adminNavGroups.map((group) => (
                    <SidebarGroup key={group.label} className="px-3">
                        <SidebarGroupLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1">
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentOrParentUrl(
                                            item.href,
                                        )}
                                        tooltip={{ children: item.title }}
                                        className="relative font-medium text-sidebar-foreground/55 hover:text-sidebar-foreground data-[active=true]:font-bold data-[active=true]:text-sidebar-accent-foreground data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:left-0 data-[active=true]:before:w-1 data-[active=true]:before:rounded-full data-[active=true]:before:bg-primary [&>svg]:opacity-80 data-[active=true]:[&>svg]:opacity-100"
                                    >
                                        <Link href={item.href} prefetch>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    {item.showNewLeadsBadge &&
                                        newLeadsCount > 0 && (
                                            <SidebarMenuBadge>
                                                {newLeadsCount}
                                            </SidebarMenuBadge>
                                        )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarSeparator className="mx-0" />
            <SidebarFooter className="p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Lihat website' }}
                            className="font-medium text-sidebar-foreground/55 hover:text-sidebar-foreground"
                        >
                            <a
                                href={toUrl(home())}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLinkIcon />
                                <span>Lihat website</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
