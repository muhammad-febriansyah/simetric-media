import { Link, router } from '@inertiajs/react';
import { GlobeIcon, LogOut, ShieldCheckIcon, UserIcon } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { toUrl } from '@/lib/utils';
import { home, logout } from '@/routes';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <UserIcon />
                        Profil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        className="w-full cursor-pointer"
                        href={editSecurity()}
                        onClick={cleanup}
                    >
                        <ShieldCheckIcon />
                        Keamanan
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a
                        className="w-full cursor-pointer"
                        href={toUrl(home())}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GlobeIcon />
                        Lihat website
                    </a>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild variant="destructive">
                    <Link
                        className="w-full cursor-pointer"
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        data-test="logout-button"
                    >
                        <LogOut />
                        Keluar
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </>
    );
}
