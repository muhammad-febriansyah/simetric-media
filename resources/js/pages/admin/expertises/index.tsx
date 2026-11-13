import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { PublishBadge } from '@/components/admin/status-badges';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { RowActions } from '@/components/data-table/row-actions';
import { ContentIcon } from '@/components/site/content-icon';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, destroy, edit, index } from '@/routes/admin/expertises';
import type { Expertise } from '@/types';

const columns: ColumnDef<Expertise>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Bidang keahlian" />
        ),
        cell: ({ row }) => (
            <div className="flex max-w-lg items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <ContentIcon iconName={row.original.icon} />
                </span>
                <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">
                        {row.original.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                        {row.original.description ?? '-'}
                    </span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'services_count',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Layanan" />
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
                deleteDescription={
                    row.original.services_count
                        ? `Bidang ini masih berisi ${row.original.services_count} layanan. Pindahkan layanannya ke bidang lain terlebih dahulu.`
                        : undefined
                }
            />
        ),
    },
];

export default function ExpertiseIndex({
    expertises,
}: {
    expertises: Expertise[];
}) {
    return (
        <>
            <Head title="Bidang Keahlian" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar bidang keahlian</CardTitle>
                    <CardDescription>
                        Setiap bidang mengelompokkan layanan di halaman
                        Keahlian.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={expertises}
                        searchKey="name"
                        searchPlaceholder="Cari bidang keahlian..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah bidang
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada bidang keahlian"
                        emptyDescription="Tambahkan bidang seperti Konsultasi & Strategi, Desain, Pengembangan, atau Pendampingan."
                    />
                </CardContent>
            </Card>
        </>
    );
}

ExpertiseIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Bidang Keahlian', href: index() },
    ],
    title: 'Bidang Keahlian',
    description:
        'Kelola pilar keahlian yang mengelompokkan layanan di halaman Keahlian.',
};
