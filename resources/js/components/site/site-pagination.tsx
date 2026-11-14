import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Previous / next pagination for public listings. Renders nothing for a single page.
 */
export function SitePagination({
    currentPage,
    lastPage,
    onPageChange,
}: {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}) {
    if (lastPage <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Halaman"
            className="flex flex-wrap items-center justify-center gap-3"
        >
            <Button
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeftIcon data-icon="inline-start" />
                Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {lastPage}
            </span>
            <Button
                variant="secondary"
                disabled={currentPage >= lastPage}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Berikutnya
                <ChevronRightIcon data-icon="inline-end" />
            </Button>
        </nav>
    );
}
