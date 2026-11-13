import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon, StarIcon } from 'lucide-react';
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
import { create, destroy, edit, index } from '@/routes/admin/case-studies';
import { show as showPublic } from '@/routes/case-studies';
import type { CaseStudy } from '@/types';

const columns: ColumnDef<CaseStudy>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Judul" />
        ),
        cell: ({ row }) => (
            <div className="flex max-w-md flex-col">
                <span className="truncate font-medium">
                    {row.original.title}
                </span>
                <span className="text-xs text-muted-foreground">
                    {row.original.client_name}
                </span>
            </div>
        ),
    },
    {
        id: 'industry',
        header: 'Industri',
        cell: ({ row }) => row.original.industry?.name ?? '-',
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <div className="flex gap-2">
                <PublishBadge isPublished={row.original.is_published} />
                {row.original.is_featured && (
                    <Badge variant="outline">
                        <StarIcon />
                        Unggulan
                    </Badge>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'sort_order',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Urutan" />
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
                itemLabel={row.original.title}
            />
        ),
    },
];

export default function CaseStudyIndex({
    caseStudies,
}: {
    caseStudies: CaseStudy[];
}) {
    return (
        <>
            <Head title="Studi Kasus" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar studi kasus</CardTitle>
                    <CardDescription>
                        Bukti kerja yang diceritakan per tahap konsultasi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={caseStudies}
                        searchKey="title"
                        searchPlaceholder="Cari judul studi kasus..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah studi kasus
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada studi kasus"
                        emptyDescription="Tambahkan studi kasus pertama untuk ditampilkan di website."
                    />
                </CardContent>
            </Card>
        </>
    );
}

CaseStudyIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Studi Kasus', href: index() },
    ],
    title: 'Studi Kasus',
    description: 'Kelola studi kasus yang tampil di website.',
};
