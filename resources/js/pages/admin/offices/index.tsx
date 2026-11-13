import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { RowActions } from '@/components/data-table/row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, destroy, edit, index } from '@/routes/admin/offices';
import type { Office } from '@/types';

const columns: ColumnDef<Office>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kantor" />
        ),
        cell: ({ row }) => (
            <div className="flex max-w-md flex-col">
                <span className="font-medium">{row.original.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                    {row.original.address}
                </span>
            </div>
        ),
    },
    {
        id: 'type',
        header: 'Tipe',
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.type.value === 'head' ? 'default' : 'outline'
                }
            >
                {row.original.type.label}
            </Badge>
        ),
    },
    {
        accessorKey: 'city',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kota" />
        ),
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? 'success' : 'secondary'}>
                {row.original.is_active ? 'Aktif' : 'Nonaktif'}
            </Badge>
        ),
    },

    {
        id: 'actions',
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => (
            <RowActions
                editHref={edit(row.original.id)}
                onDelete={() =>
                    router.delete(destroy(row.original.id), {
                        preserveScroll: true,
                    })
                }
                itemLabel={row.original.name}
            />
        ),
    },
];

export default function OfficeIndex({ offices }: { offices: Office[] }) {
    return (
        <>
            <Head title="Kantor" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar kantor</CardTitle>
                    <CardDescription>
                        Kantor pusat dan cabang yang tampil di halaman Kontak.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={offices}
                        searchKey="name"
                        searchPlaceholder="Cari kantor..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah kantor
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada kantor"
                        emptyDescription="Tambahkan kantor pusat terlebih dahulu."
                    />
                </CardContent>
            </Card>
        </>
    );
}

OfficeIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Kantor', href: index() },
    ],
    title: 'Kantor',
    description: 'Kelola alamat kantor pusat dan cabang.',
};
