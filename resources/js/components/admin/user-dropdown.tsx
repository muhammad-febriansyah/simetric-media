import { usePage } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';

/**
 * Avatar button in the top bar with the account menu.
 */
export function UserDropdown() {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    if (!auth.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-11 gap-3 rounded-full py-1 pr-3 pl-1"
                    data-test="sidebar-menu-button"
                >
                    <Avatar className="size-9">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden flex-col items-start leading-tight md:flex">
                        <span className="text-sm font-semibold">
                            {auth.user.name}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {auth.user.is_admin ? 'Administrator' : 'Pengguna'}
                        </span>
                    </span>
                    <ChevronDownIcon
                        data-icon="inline-end"
                        className="hidden text-muted-foreground md:block"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-xl">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
