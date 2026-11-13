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
import { create, destroy, edit, index } from '@/routes/admin/team-members';
import type { TeamMember } from '@/types';

const columns: ColumnDef<TeamMember>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="size-10">
                    <AvatarImage
                        src={row.original.photo_url ?? undefined}
                        alt={row.original.name}
                    />
                    <AvatarFallback className="bg-accent text-accent-foreground">
                        {row.original.name.slice(0, 1)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex max-w-xs flex-col">
                    <span className="truncate font-medium">
                        {row.original.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                        {row.original.position}
                    </span>
                </div>
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
                itemLabel={row.original.name}
            />
        ),
    },
];

export default function TeamMemberIndex({
    teamMembers,
}: {
    teamMembers: TeamMember[];
}) {
    return (
        <>
            <Head title="Tim" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar anggota tim</CardTitle>
                    <CardDescription>
                        Orang-orang di balik konsultasi, tampil di halaman
                        Tentang.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={teamMembers}
                        searchKey="name"
                        searchPlaceholder="Cari nama..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah anggota
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada anggota tim"
                        emptyDescription="Tambahkan anggota tim yang ingin ditampilkan."
                    />
                </CardContent>
            </Card>
        </>
    );
}

TeamMemberIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tim', href: index() },
    ],
    title: 'Tim',
    description: 'Kelola anggota tim yang tampil di website.',
};
