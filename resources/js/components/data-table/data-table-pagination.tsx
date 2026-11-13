import type { Table } from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
    // The table instance is mutable and keeps the same reference, so skip React Compiler memoization.
    'use no memo';

    const { pageIndex, pageSize } = table.getState().pagination;
    const totalRows = table.getRowCount();
    const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Menampilkan {firstRow}–{lastRow} dari {totalRows} data
            </p>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Baris</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(value) =>
                            table.setPageSize(Number(value))
                        }
                    >
                        <SelectTrigger size="sm" className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectGroup>
                                {PAGE_SIZE_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option}
                                        value={String(option)}
                                    >
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeftIcon />
                        <span className="sr-only">Halaman sebelumnya</span>
                    </Button>
                    <span className="text-sm font-medium">
                        {table.getPageCount() === 0 ? 0 : pageIndex + 1} /{' '}
                        {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRightIcon />
                        <span className="sr-only">Halaman berikutnya</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
