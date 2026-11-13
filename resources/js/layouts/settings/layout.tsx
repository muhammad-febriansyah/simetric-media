import { Link } from '@inertiajs/react';
import { ShieldCheckIcon, UserIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: UserIcon,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: ShieldCheckIcon,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <Card className="py-3">
                <CardContent className="px-3">
                    <nav
                        className="flex gap-1 lg:flex-col"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('justify-start lg:w-full', {
                                    'bg-accent text-accent-foreground':
                                        isCurrentOrParentUrl(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon data-icon="inline-start" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </CardContent>
            </Card>

            <div className="flex max-w-3xl min-w-0 flex-col gap-6">
                {children}
            </div>
        </div>
    );
}
