import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    Updater,
} from '@tanstack/react-table';
import { InboxIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { PaginationMeta } from '@/types';

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    /** Column id used by the search input. Omit to hide the search input. */
    searchKey?: string;
    searchPlaceholder?: string;
    /** Extra controls rendered on the right of the toolbar (e.g. an "Add" button). */
    toolbar?: ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    pageSize?: number;
    /** Hide the pagination bar, e.g. for short "latest items" tables. */
    showPagination?: boolean;
    /**
     * Server-side pagination (e.g. a Laravel paginator). When set, rows are not
     * paginated in the browser and page changes are delegated to the callbacks.
     */
    serverPagination?: {
        meta: PaginationMeta;
        onPageChange: (page: number) => void;
        onPageSizeChange: (pageSize: number) => void;
    };
    /** Server-side search. When set, the search input is controlled by the parent. */
    serverSearch?: {
        value: string;
        onChange: (value: string) => void;
    };
};

/**
 * Standard list table: automatic "No" column, search, sorting,
 * pagination and empty state.
 */
export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder = 'Cari...',
    toolbar,
    emptyTitle = 'Belum ada data',
    emptyDescription = 'Data yang ditambahkan akan tampil di sini.',
    pageSize = 10,
    showPagination = true,
    serverPagination,
    serverSearch,
}: DataTableProps<TData, TValue>) {
    'use no memo';

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [clientPagination, setClientPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize,
    });

    const pagination: PaginationState = serverPagination
        ? {
              pageIndex: serverPagination.meta.current_page - 1,
              pageSize: serverPagination.meta.per_page ?? pageSize,
          }
        : clientPagination;

    const handlePaginationChange = (updater: Updater<PaginationState>) => {
        const next =
            typeof updater === 'function' ? updater(pagination) : updater;

        if (!serverPagination) {
            setClientPagination(next);

            return;
        }

        if (next.pageSize !== pagination.pageSize) {
            serverPagination.onPageSizeChange(next.pageSize);
        } else if (next.pageIndex !== pagination.pageIndex) {
            serverPagination.onPageChange(next.pageIndex + 1);
        }
    };

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, pagination },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: handlePaginationChange,
        manualPagination: Boolean(serverPagination),
        pageCount: serverPagination?.meta.last_page,
        rowCount: serverPagination?.meta.total,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const { pageIndex, pageSize: currentPageSize } = pagination;
    const rows = table.getRowModel().rows;
    const searchColumn = searchKey ? table.getColumn(searchKey) : undefined;
    const hasSearch = Boolean(serverSearch || searchColumn);

    return (
        <div className="flex flex-col gap-4">
            {(hasSearch || toolbar) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {hasSearch ? (
                        <div className="relative w-full sm:max-w-xs">
                            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={
                                    serverSearch
                                        ? serverSearch.value
                                        : ((searchColumn?.getFilterValue() as string) ??
                                          '')
                                }
                                onChange={(event) => {
                                    if (serverSearch) {
                                        serverSearch.onChange(
                                            event.target.value,
                                        );

                                        return;
                                    }

                                    searchColumn?.setFilterValue(
                                        event.target.value,
                                    );
                                    table.setPageIndex(0);
                                }}
                                placeholder={searchPlaceholder}
                                className="pl-10"
                            />
                        </div>
                    ) : (
                        <div />
                    )}
                    {toolbar && (
                        <div className="flex items-center gap-2">{toolbar}</div>
                    )}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border">
                <Table>
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-muted"
                            >
                                <TableHead className="w-16">No</TableHead>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell className="text-muted-foreground">
                                        {pageIndex * currentPageSize +
                                            index +
                                            1}
                                    </TableCell>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length + 1}>
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <InboxIcon />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                {emptyTitle}
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                {emptyDescription}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showPagination && <DataTablePagination table={table} />}
        </div>
    );
}
