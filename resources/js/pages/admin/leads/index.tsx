import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { LeadStatusBadge } from '@/components/admin/status-badges';
import { DataTable } from '@/components/data-table/data-table';
import { RowActions } from '@/components/data-table/row-actions';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import { destroy, index, show } from '@/routes/admin/leads';
import type { Lead, Option, Paginated } from '@/types';

type Filters = {
    search: string;
    status: string;
};

type Props = {
    leads: Paginated<Lead>;
    filters: Filters;
    statusOptions: Option[];
};

const ALL_STATUSES = 'all';

const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: 'name',
        header: 'Nama',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.name}</span>
                <span className="text-xs text-muted-foreground">
                    {row.original.email}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'company_name',
        header: 'Perusahaan',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span>{row.original.company_name}</span>
                <span className="text-xs text-muted-foreground">
                    {row.original.industry?.name ?? '-'}
                </span>
            </div>
        ),
    },
    {
        id: 'problem_area',
        header: 'Area masalah',
        cell: ({ row }) => row.original.problem_area.label,
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <LeadStatusBadge status={row.original.status} />,
    },
    {
        id: 'assignee',
        header: 'PIC',
        cell: ({ row }) => row.original.assignee?.name ?? '-',
    },
    {
        accessorKey: 'created_at_label',
        header: 'Masuk',
    },
    {
        id: 'actions',
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => (
            <RowActions
                viewHref={show(row.original.id)}
                onDelete={() =>
                    router.delete(destroy(row.original.id), {
                        preserveScroll: true,
                    })
                }
                itemLabel={`${row.original.name} (${row.original.company_name})`}
            />
        ),
    },
];

export default function LeadIndex({ leads, filters, statusOptions }: Props) {
    const [search, setSearch] = useState(filters.search);
    const isFirstRender = useRef(true);

    const visit = (query: Record<string, string | number | undefined>) => {
        router.get(
            index.url(),
            {
                search: search || undefined,
                status: filters.status || undefined,
                per_page: leads.meta.per_page,
                ...query,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        const timeout = setTimeout(
            () => visit({ search: search || undefined, page: undefined }),
            350,
        );

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <>
            <Head title="Lead Konsultasi" />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar lead</CardTitle>
                    <CardDescription>
                        Semua permintaan konsultasi yang masuk dari website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={leads.data}
                        searchPlaceholder="Cari nama, perusahaan, atau email..."
                        serverSearch={{ value: search, onChange: setSearch }}
                        serverPagination={{
                            meta: leads.meta,
                            onPageChange: (page) => visit({ page }),
                            onPageSizeChange: (perPage) =>
                                visit({ per_page: perPage, page: undefined }),
                        }}
                        toolbar={
                            <Select
                                value={filters.status || ALL_STATUSES}
                                onValueChange={(value) =>
                                    visit({
                                        status:
                                            value === ALL_STATUSES
                                                ? undefined
                                                : value,
                                        page: undefined,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Semua status" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectGroup>
                                        <SelectItem value={ALL_STATUSES}>
                                            Semua status
                                        </SelectItem>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        }
                        emptyTitle="Lead tidak ditemukan"
                        emptyDescription="Coba ubah kata kunci atau filter status."
                    />
                </CardContent>
            </Card>
        </>
    );
}

LeadIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Lead Konsultasi', href: index() },
    ],
    title: 'Lead Konsultasi',
    description: 'Tindak lanjuti permintaan konsultasi dari calon klien.',
};
