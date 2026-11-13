import { router, usePage } from '@inertiajs/react';
import { BellIcon, CheckCheckIcon, InboxIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { read, readAll } from '@/routes/admin/notifications';

/**
 * Bell button in the top bar. Opens a sheet with the latest notifications
 * (new consultation leads) for the signed-in admin.
 */
export function NotificationSheet() {
    const { admin } = usePage().props;
    const [open, setOpen] = useState(false);

    if (!admin) {
        return null;
    }

    const { unreadCount, items } = admin.notifications;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <BellIcon />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">
                        Notifikasi ({unreadCount} belum dibaca)
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
            >
                <SheetHeader className="border-b border-border p-6">
                    <SheetTitle>Notifikasi</SheetTitle>
                    <SheetDescription>
                        {unreadCount > 0
                            ? `${unreadCount} notifikasi belum dibaca`
                            : 'Semua notifikasi sudah dibaca'}
                    </SheetDescription>
                    {unreadCount > 0 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-2 self-start"
                            onClick={() =>
                                router.post(
                                    readAll(),
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                        >
                            <CheckCheckIcon data-icon="inline-start" />
                            Tandai semua dibaca
                        </Button>
                    )}
                </SheetHeader>

                {items.length === 0 ? (
                    <Empty className="flex-1">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <BellIcon />
                            </EmptyMedia>
                            <EmptyTitle>Belum ada notifikasi</EmptyTitle>
                            <EmptyDescription>
                                Lead baru dari form konsultasi akan muncul di
                                sini.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:block!">
                        <ul className="flex flex-col p-3">
                            {items.map((notification) => (
                                <li key={notification.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpen(false);
                                            router.post(read(notification.id));
                                        }}
                                        className={cn(
                                            'flex w-full cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-accent',
                                            !notification.read &&
                                                'bg-accent/50',
                                        )}
                                    >
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                            <InboxIcon className="size-5" />
                                        </span>
                                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span className="text-sm font-semibold">
                                                Lead baru:{' '}
                                                {notification.data.name}
                                            </span>
                                            <span className="truncate text-sm text-muted-foreground">
                                                {notification.data.company_name}{' '}
                                                ·{' '}
                                                {notification.data.problem_area}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {notification.created_at_human}
                                            </span>
                                        </span>
                                        {!notification.read && (
                                            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
}
