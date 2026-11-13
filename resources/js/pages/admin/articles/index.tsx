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
import { create, destroy, edit, index } from '@/routes/admin/articles';
import type { Article } from '@/types';

const columns: ColumnDef<Article>[] = [
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
                    {row.original.author?.name ?? '-'}
                </span>
            </div>
        ),
    },
    {
        id: 'category',
        header: 'Kategori',
        cell: ({ row }) => row.original.category ?? '-',
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <PublishBadge isPublished={row.original.is_published} />
        ),
    },
    {
        id: 'published_at',
        header: 'Terbit',
        cell: ({ row }) => row.original.published_at_label ?? '-',
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

export default function ArticleIndex({ articles }: { articles: Article[] }) {
    return (
        <>
            <Head title="Insight" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar artikel</CardTitle>
                    <CardDescription>
                        Artikel insight untuk SEO dan menunjukkan keahlian.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={articles}
                        searchKey="title"
                        searchPlaceholder="Cari judul artikel..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tulis artikel
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada artikel"
                        emptyDescription="Tulis artikel pertama untuk halaman Insight."
                    />
                </CardContent>
            </Card>
        </>
    );
}

ArticleIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Insight', href: index() },
    ],
    title: 'Insight',
    description: 'Kelola artikel insight yang tampil di website.',
};
