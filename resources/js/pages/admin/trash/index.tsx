import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { RotateCcwIcon } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { RowActions } from '@/components/data-table/row-actions';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { dashboard } from '@/routes';
import { destroy, index, restore } from '@/routes/admin/trash';
import type { TrashItem } from '@/types';

const columns: ColumnDef<TrashItem>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Judul / nama" />
        ),
        cell: ({ row }) => (
            <span className="block max-w-md truncate font-medium">
                {row.original.title}
            </span>
        ),
    },
    {
        id: 'type',
        header: 'Jenis',
        cell: ({ row }) => (
            <Badge variant="outline">{row.original.type_label}</Badge>
        ),
    },
    {
        accessorKey: 'deleted_at_label',
        header: 'Dihapus',
    },
    {
        id: 'actions',
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => {
            const args = { type: row.original.type, id: row.original.id };

            return (
                <RowActions
                    onDelete={() =>
                        router.delete(destroy(args), { preserveScroll: true })
                    }
                    itemLabel={row.original.title}
                    deleteLabel="Hapus permanen"
                    deleteTitle="Hapus permanen?"
                    deleteDescription={`"${row.original.title}" beserta file gambarnya akan dihapus selamanya dan tidak bisa dipulihkan.`}
                >
                    <DropdownMenuItem
                        onSelect={() =>
                            router.post(
                                restore(args),
                                {},
                                { preserveScroll: true },
                            )
                        }
                    >
                        <RotateCcwIcon />
                        Pulihkan
                    </DropdownMenuItem>
                </RowActions>
            );
        },
    },
];

export default function TrashIndex({ items }: { items: TrashItem[] }) {
    return (
        <>
            <Head title="Data Terhapus" />

            <Card>
                <CardHeader>
                    <CardTitle>Data terhapus</CardTitle>
                    <CardDescription>
                        Lead, studi kasus, dan artikel yang dihapus bisa
                        dipulihkan dari sini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={items}
                        searchKey="title"
                        searchPlaceholder="Cari judul atau nama..."
                        emptyTitle="Tidak ada data terhapus"
                        emptyDescription="Data yang dihapus akan muncul di sini dan bisa dipulihkan."
                    />
                </CardContent>
            </Card>
        </>
    );
}

TrashIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Data Terhapus', href: index() },
    ],
    title: 'Data Terhapus',
    description: 'Pulihkan data yang terhapus atau hapus permanen.',
};
