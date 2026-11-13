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
import { create, destroy, edit, index } from '@/routes/admin/faqs';
import type { Faq } from '@/types';

const columns: ColumnDef<Faq>[] = [
    {
        accessorKey: 'question',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pertanyaan" />
        ),
        cell: ({ row }) => (
            <div className="flex max-w-md flex-col">
                <span className="truncate font-medium">
                    {row.original.question}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    {row.original.placement_label}
                </span>
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
                itemLabel={row.original.question}
            />
        ),
    },
];

export default function FaqIndex({ faqs }: { faqs: Faq[] }) {
    return (
        <>
            <Head title="FAQ" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar FAQ</CardTitle>
                    <CardDescription>
                        Pertanyaan yang sering ditanyakan calon klien.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={faqs}
                        searchKey="question"
                        searchPlaceholder="Cari pertanyaan..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah FAQ
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada FAQ"
                        emptyDescription="Tambahkan pertanyaan yang sering ditanyakan calon klien."
                    />
                </CardContent>
            </Card>
        </>
    );
}

FaqIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'FAQ', href: index() },
    ],
    title: 'FAQ',
    description:
        'Kelola FAQ di halaman Cara Kerja, Tentang, Konsultasi, layanan, industri, dan solusi.',
};
