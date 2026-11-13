import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { PublishBadge } from '@/components/admin/status-badges';
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
import { create, destroy, edit, index } from '@/routes/admin/services';
import { show as showPublic } from '@/routes/services';
import type { Service } from '@/types';

const columns: ColumnDef<Service>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Layanan" />
        ),
        cell: ({ row }) => (
            <div className="flex max-w-md flex-col">
                <span className="font-medium">{row.original.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                    {row.original.headline ?? '-'}
                </span>
            </div>
        ),
    },
    {
        id: 'expertise',
        header: 'Bidang keahlian',
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.expertise?.name ?? '-'}
            </Badge>
        ),
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
            <PublishBadge isPublished={row.original.is_published} />
        ),
    },
    {
        id: 'actions',
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => (
            <RowActions
                viewHref={
                    row.original.is_published
                        ? showPublic(row.original.slug)
                        : undefined
                }
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

export default function ServiceIndex({ services }: { services: Service[] }) {
    return (
        <>
            <Head title="Layanan" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar layanan</CardTitle>
                    <CardDescription>
                        Layanan ditulis dari sudut pandang masalah klien.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={services}
                        searchKey="name"
                        searchPlaceholder="Cari layanan..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah layanan
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada layanan"
                        emptyDescription="Tambahkan layanan pertama perusahaan."
                    />
                </CardContent>
            </Card>
        </>
    );
}

ServiceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Layanan', href: index() },
    ],
    title: 'Layanan',
    description: 'Kelola layanan konsultasi yang tampil di website.',
};
