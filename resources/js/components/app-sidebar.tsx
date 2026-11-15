import { Link, usePage } from '@inertiajs/react';
import { ExternalLinkIcon, GlobeIcon } from 'lucide-react';
import { adminNavGroups } from '@/components/admin/admin-navigation';
import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { dashboard, home } from '@/routes';

export function AppSidebar() {
    const { name, site, admin } = usePage().props;
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
                            tooltip={{ children: name }}
                            className="px-1 py-0.5 group-data-[collapsible=icon]:justify-center hover:bg-transparent"
                        >
                            <Link href={dashboard()} prefetch aria-label={name}>
                                {site.site_logo_url ? (
                                    <>
                                        <img
                                            src={site.site_logo_url}
                                            alt={name}
                                            className="h-11 w-auto max-w-[13rem] object-contain object-left group-data-[collapsible=icon]:hidden"
                                        />
                                        <span className="hidden group-data-[collapsible=icon]:flex">
                                            {site.site_favicon_url ? (
                                                <img
                                                    src={site.site_favicon_url}
                                                    alt=""
                                                    className="size-8 object-contain"
                                                />
                                            ) : (
                                                <BrandMark className="size-8" />
                                            )}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <BrandMark />
                                        <span className="truncate font-semibold">
                                            {name}
                                        </span>
                                    </>
                                )}
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

            <SidebarFooter className="p-3">
                {/* Expanded sidebar: promo-style card */}
                <div className="relative overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground group-data-[collapsible=icon]:hidden">
                    <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-primary-foreground/10" />
                    <div className="pointer-events-none absolute -right-2 -bottom-10 size-20 rounded-full bg-primary-foreground/10" />
                    <div className="relative flex flex-col gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
                            <GlobeIcon className="size-5" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold">
                                Website publik
                            </span>
                            <span className="text-xs text-primary-foreground/75">
                                Cek hasil perubahan konten Anda.
                            </span>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            variant="secondary"
                            className="w-full bg-card text-primary hover:bg-card/90"
                        >
                            <a
                                href={toUrl(home())}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLinkIcon data-icon="inline-start" />
                                Lihat website
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Collapsed sidebar: icon only */}
                <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Lihat website' }}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        >
                            <a
                                href={toUrl(home())}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GlobeIcon />
                                <span>Lihat website</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
