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
import { create, destroy, edit, index } from '@/routes/admin/client-logos';
import type { ClientLogo } from '@/types';

const columns: ColumnDef<ClientLogo>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Klien" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <img
                    src={row.original.logo_url}
                    alt={row.original.name}
                    className="h-10 w-20 rounded-lg bg-muted object-contain p-1"
                />
                <span className="font-medium">{row.original.name}</span>
            </div>
        ),
    },
    {
        id: 'industry',
        header: 'Industri',
        cell: ({ row }) => row.original.industry?.name ?? '-',
    },
    {
        accessorKey: 'sort_order',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Urutan" />
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

export default function ClientLogoIndex({
    clientLogos,
}: {
    clientLogos: ClientLogo[];
}) {
    return (
        <>
            <Head title="Logo Klien" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar logo klien</CardTitle>
                    <CardDescription>
                        Logo "Trusted Partners" di Beranda dan halaman industri.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={clientLogos}
                        searchKey="name"
                        searchPlaceholder="Cari nama klien..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah logo
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada logo klien"
                        emptyDescription="Tambahkan logo klien yang sudah memberi izin."
                    />
                </CardContent>
            </Card>
        </>
    );
}

ClientLogoIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Logo Klien', href: index() },
    ],
    title: 'Logo Klien',
    description: 'Kelola logo klien yang tampil di website.',
};
