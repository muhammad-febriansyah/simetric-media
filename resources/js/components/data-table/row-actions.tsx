import type { InertiaLinkProps } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import {
    EyeIcon,
    MoreHorizontalIcon,
    PencilIcon,
    Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type LinkHref = NonNullable<InertiaLinkProps['href']>;

type RowActionsProps = {
    viewHref?: LinkHref;
    editHref?: LinkHref;
    onDelete?: () => void;
    /** Name of the row's item, shown in the delete confirmation. */
    itemLabel?: string;
    /** Extra DropdownMenuItem elements rendered between Edit and Delete. */
    children?: ReactNode;
    deleteLabel?: string;
    deleteTitle?: string;
    deleteDescription?: string;
};

/**
 * Three-dot row action menu: View, Edit and Delete (with confirmation).
 */
export function RowActions({
    viewHref,
    editHref,
    onDelete,
    itemLabel,
    children,
    deleteLabel = 'Hapus',
    deleteTitle = 'Hapus data ini?',
    deleteDescription,
}: RowActionsProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <div className="flex justify-end">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Buka menu aksi</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuGroup>
                        {viewHref && (
                            <DropdownMenuItem asChild>
                                <Link href={viewHref}>
                                    <EyeIcon />
                                    Lihat
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {editHref && (
                            <DropdownMenuItem asChild>
                                <Link href={editHref}>
                                    <PencilIcon />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {children}
                    </DropdownMenuGroup>
                    {onDelete && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={() => setIsConfirmOpen(true)}
                                >
                                    <Trash2Icon />
                                    {deleteLabel}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {onDelete && (
                <ConfirmDialog
                    open={isConfirmOpen}
                    onOpenChange={setIsConfirmOpen}
                    title={deleteTitle}
                    confirmLabel={deleteLabel}
                    description={
                        deleteDescription ??
                        (itemLabel
                            ? `"${itemLabel}" akan dihapus. Tindakan ini tidak bisa dibatalkan.`
                            : 'Data akan dihapus. Tindakan ini tidak bisa dibatalkan.')
                    }
                    onConfirm={onDelete}
                />
            )}
        </div>
    );
}
