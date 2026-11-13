import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
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
import { create, destroy, edit, index } from '@/routes/admin/milestones';
import type { CompanyMilestone } from '@/types';

const columns: ColumnDef<CompanyMilestone>[] = [
    {
        accessorKey: 'year',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tahun" />
        ),
        cell: ({ row }) => (
            <span className="font-semibold">{row.original.year}</span>
        ),
    },
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Judul" />
        ),
        cell: ({ row }) => (
            <div className="flex max-w-md flex-col">
                <span className="font-medium">{row.original.title}</span>
                <span className="truncate text-xs text-muted-foreground">
                    {row.original.description ?? '-'}
                </span>
            </div>
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
                itemLabel={row.original.title}
            />
        ),
    },
];

export default function MilestoneIndex({
    milestones,
}: {
    milestones: CompanyMilestone[];
}) {
    return (
        <>
            <Head title="Perjalanan Perusahaan" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar milestone</CardTitle>
                    <CardDescription>
                        Timeline perjalanan perusahaan di halaman Tentang.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={milestones}
                        searchKey="title"
                        searchPlaceholder="Cari milestone..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah milestone
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada milestone"
                        emptyDescription="Tambahkan momen penting perjalanan perusahaan."
                    />
                </CardContent>
            </Card>
        </>
    );
}

MilestoneIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Perjalanan Perusahaan', href: index() },
    ],
    title: 'Perjalanan Perusahaan',
    description: 'Kelola timeline sejarah perusahaan.',
};
