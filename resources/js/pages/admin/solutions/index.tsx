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
import { create, destroy, edit, index } from '@/routes/admin/solutions';
import type { Solution } from '@/types';

const columns: ColumnDef<Solution>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Solusi" />
        ),
        cell: ({ row }) => (
            <div className="flex max-w-md flex-col">
                <span className="truncate font-medium">
                    {row.original.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    {row.original.headline ?? '-'}
                </span>
            </div>
        ),
    },
    {
        id: 'business_function',
        header: 'Divisi',
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.business_function.label}
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

export default function SolutionIndex({
    solutions,
}: {
    solutions: Solution[];
}) {
    return (
        <>
            <Head title="Solusi" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar solusi</CardTitle>
                    <CardDescription>
                        Solusi dikelompokkan per divisi bisnis klien.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={solutions}
                        searchKey="name"
                        searchPlaceholder="Cari solusi..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah solusi
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada solusi"
                        emptyDescription="Tambahkan solusi untuk divisi Operasional, Penjualan, Keuangan, SDM, atau IT."
                    />
                </CardContent>
            </Card>
        </>
    );
}

SolutionIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Solusi', href: index() },
    ],
    title: 'Solusi',
    description: 'Kelola solusi per divisi bisnis yang tampil di website.',
};
