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
import { create, destroy, edit, index } from '@/routes/admin/users';
import type { AdminUser } from '@/types';

const columns: ColumnDef<AdminUser>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">
                    {row.original.name}
                    {row.original.is_current && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            (Anda)
                        </span>
                    )}
                </span>
                <span className="text-xs text-muted-foreground">
                    {row.original.email}
                </span>
            </div>
        ),
    },
    {
        id: 'role',
        header: 'Akses',
        cell: ({ row }) => (
            <Badge variant={row.original.is_admin ? 'default' : 'secondary'}>
                {row.original.is_admin ? 'Admin' : 'Tanpa akses admin'}
            </Badge>
        ),
    },
    {
        id: 'two_factor',
        header: '2FA',
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.two_factor_enabled ? 'success' : 'outline'
                }
            >
                {row.original.two_factor_enabled ? 'Aktif' : 'Belum'}
            </Badge>
        ),
    },
    {
        id: 'leads',
        header: 'Lead ditangani',
        cell: ({ row }) => row.original.assigned_leads_count ?? 0,
    },
    {
        id: 'created',
        header: 'Dibuat',
        cell: ({ row }) => row.original.created_at_label ?? '-',
    },

    {
        id: 'actions',
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => (
            <RowActions
                editHref={edit(row.original.id)}
                onDelete={
                    row.original.is_current
                        ? undefined
                        : () =>
                              router.delete(destroy(row.original.id), {
                                  preserveScroll: true,
                              })
                }
                itemLabel={row.original.name}
            />
        ),
    },
];

export default function UserIndex({ users }: { users: AdminUser[] }) {
    return (
        <>
            <Head title="Pengguna" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar pengguna</CardTitle>
                    <CardDescription>
                        Akun yang bisa masuk ke panel admin dan menjadi PIC
                        lead.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={users}
                        searchKey="name"
                        searchPlaceholder="Cari nama..."
                        toolbar={
                            <Button asChild>
                                <Link href={create()}>
                                    <PlusIcon data-icon="inline-start" />
                                    Tambah pengguna
                                </Link>
                            </Button>
                        }
                        emptyTitle="Belum ada pengguna"
                        emptyDescription="Tambahkan akun untuk rekan tim."
                    />
                </CardContent>
            </Card>
        </>
    );
}

UserIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pengguna', href: index() },
    ],
    title: 'Pengguna',
    description: 'Kelola akun admin dan akses ke panel.',
};
