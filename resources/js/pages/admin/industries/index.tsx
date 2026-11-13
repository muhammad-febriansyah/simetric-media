import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { PublishBadge } from '@/components/admin/status-badges';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { RowActions } from '@/components/data-table/row-actions';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, destroy, edit, index } from '@/routes/admin/industries';
import { show as showPublic } from '@/routes/industries';
import type { Industry } from '@/types';

const columns: ColumnDef<Industry>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Industri" />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.name}</span>
                <span className="text-xs text-muted-foreground">
                    /{row.original.slug}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'case_studies_count',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Studi kasus" />
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

export default function IndustryIndex({
    industries,
}: {
    industries: Industry[];
}) {
    return (
        <>
            <Head title="Industri" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar industri</CardTitle>
                    <CardDescription>
                        Industri yang dilayani beserta masalah umumnya.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={industries}
                        searchKey="name"
                        searchPlaceholder="Cari industri..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah industri
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada industri"
                        emptyDescription="Tambahkan industri yang dilayani perusahaan."
                    />
                </CardContent>
            </Card>
        </>
    );
}

IndustryIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Industri', href: index() },
    ],
    title: 'Industri',
    description: 'Kelola industri yang tampil di website.',
};
