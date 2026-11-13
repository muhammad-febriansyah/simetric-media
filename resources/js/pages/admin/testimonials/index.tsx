import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { create, destroy, edit, index } from '@/routes/admin/testimonials';
import type { Testimonial } from '@/types';

const columns: ColumnDef<Testimonial>[] = [
    {
        accessorKey: 'author_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pemberi testimoni" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="size-10">
                    <AvatarImage
                        src={row.original.photo_url ?? undefined}
                        alt={row.original.author_name}
                    />
                    <AvatarFallback className="bg-accent text-accent-foreground">
                        {row.original.author_name.slice(0, 1)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex max-w-xs flex-col">
                    <span className="truncate font-medium">
                        {row.original.author_name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                        {[row.original.author_position, row.original.company]
                            .filter(Boolean)
                            .join(' · ') || '-'}
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: 'case_study',
        header: 'Studi kasus',
        cell: ({ row }) => row.original.case_study?.title ?? '-',
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
                itemLabel={row.original.author_name}
            />
        ),
    },
];

export default function TestimonialIndex({
    testimonials,
}: {
    testimonials: Testimonial[];
}) {
    return (
        <>
            <Head title="Testimoni" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar testimoni</CardTitle>
                    <CardDescription>
                        Kutipan klien untuk membangun kepercayaan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={testimonials}
                        searchKey="author_name"
                        searchPlaceholder="Cari nama..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah testimoni
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada testimoni"
                        emptyDescription="Tambahkan kutipan dari klien yang sudah memberi izin."
                    />
                </CardContent>
            </Card>
        </>
    );
}

TestimonialIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Testimoni', href: index() },
    ],
    title: 'Testimoni',
    description: 'Kelola testimoni klien yang tampil di website.',
};
