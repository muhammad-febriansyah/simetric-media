import { router } from '@inertiajs/react';
import { GlobeIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    accountNavItems,
    adminNavGroups,
    adminQuickActions,
} from '@/components/admin/admin-navigation';
import type { AdminNavItem } from '@/components/admin/admin-navigation';
import { Button } from '@/components/ui/button';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { toUrl } from '@/lib/utils';
import { home } from '@/routes';

/**
 * Search box in the top bar that opens a command palette (⌘K / Ctrl+K)
 * for jumping to any admin page.
 */
export function CommandMenu() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key.toLowerCase() === 'k' &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault();
                setOpen((isOpen) => !isOpen);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const visit = (item: AdminNavItem) => {
        setOpen(false);
        router.visit(item.href);
    };

    const renderItem = (item: AdminNavItem) => (
        <CommandItem
            key={`${item.title}-${toUrl(item.href)}`}
            value={item.title}
            keywords={item.keywords}
            onSelect={() => visit(item)}
        >
            <item.icon />
            {item.title}
        </CommandItem>
    );

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}
                className="h-10 w-full justify-start gap-3 rounded-xl bg-muted px-3 font-normal text-muted-foreground hover:bg-accent hover:text-muted-foreground md:w-72"
            >
                <SearchIcon data-icon="inline-start" />
                <span className="flex-1 text-left">Cari menu...</span>
                <KbdGroup className="hidden md:inline-flex">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                </KbdGroup>
            </Button>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                title="Cari menu"
                description="Cari halaman atau aksi di panel admin"
                showCloseButton={false}
            >
                <CommandInput placeholder="Ketik nama menu atau aksi..." />
                <CommandList>
                    <CommandEmpty>Menu tidak ditemukan.</CommandEmpty>
                    {adminNavGroups.map((group) => (
                        <CommandGroup key={group.label} heading={group.label}>
                            {group.items.map(renderItem)}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                    <CommandGroup heading="Aksi cepat">
                        {adminQuickActions.map(renderItem)}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Akun">
                        {accountNavItems.map(renderItem)}
                        <CommandItem
                            value="Lihat website"
                            keywords={['publik', 'beranda']}
                            onSelect={() => {
                                setOpen(false);
                                window.open(toUrl(home()), '_blank');
                            }}
                        >
                            <GlobeIcon />
                            Lihat website
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
