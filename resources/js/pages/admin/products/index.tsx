import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { BoxIcon, ExternalLinkIcon, PlusIcon, StarIcon } from 'lucide-react';
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
import { create, destroy, edit, index } from '@/routes/admin/products';
import type { Product } from '@/types';

const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Produk" />
        ),
        cell: ({ row }) => (
            <div className="flex max-w-md items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted p-1">
                    {row.original.logo_url ? (
                        <img
                            src={row.original.logo_url}
                            alt={`Logo ${row.original.name}`}
                            className="size-full object-contain"
                        />
                    ) : (
                        <BoxIcon className="size-4 text-muted-foreground" />
                    )}
                </span>
                <div className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-1.5 truncate font-medium">
                        {row.original.name}
                        {row.original.is_featured && (
                            <StarIcon
                                className="size-3.5 fill-primary text-primary"
                                aria-label="Tampil di beranda"
                            />
                        )}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                        {row.original.tagline ?? '-'}
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: 'category',
        header: 'Kategori',
        cell: ({ row }) =>
            row.original.category ? (
                <Badge variant="outline">{row.original.category}</Badge>
            ) : (
                <span className="text-muted-foreground">-</span>
            ),
    },
    {
        id: 'website_url',
        header: 'Website',
        cell: ({ row }) =>
            row.original.website_url ? (
                <a
                    href={row.original.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                    {new URL(row.original.website_url).hostname}
                    <ExternalLinkIcon className="size-3.5" />
                </a>
            ) : (
                <span className="text-muted-foreground">-</span>
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

export default function ProductIndex({ products }: { products: Product[] }) {
    return (
        <>
            <Head title="Produk" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar produk</CardTitle>
                    <CardDescription>
                        Produk bertanda bintang tampil di Beranda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={products}
                        searchKey="name"
                        searchPlaceholder="Cari produk..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah produk
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada produk"
                        emptyDescription="Tambahkan produk digital yang dibangun dan dijalankan perusahaan."
                    />
                </CardContent>
            </Card>
        </>
    );
}

ProductIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Produk', href: index() },
    ],
    title: 'Produk',
    description:
        'Kelola produk digital milik perusahaan yang tampil di website.',
};
