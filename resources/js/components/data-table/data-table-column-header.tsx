import type { Column } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type DataTableColumnHeaderProps<TData, TValue> = {
    column: Column<TData, TValue>;
    title: string;
};

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
}: DataTableColumnHeaderProps<TData, TValue>) {
    // The column instance is mutable and keeps the same reference, so skip React Compiler memoization.
    'use no memo';

    if (!column.getCanSort()) {
        return <span>{title}</span>;
    }

    const sorted = column.getIsSorted();
    const SortIcon =
        sorted === 'asc'
            ? ArrowUpIcon
            : sorted === 'desc'
              ? ArrowDownIcon
              : ChevronsUpDownIcon;

    return (
        <Button
            variant="ghost"
            size="xs"
            className="-ml-3 font-semibold text-muted-foreground"
            onClick={() => column.toggleSorting(sorted === 'asc')}
        >
            {title}
            <SortIcon data-icon="inline-end" />
        </Button>
    );
}
