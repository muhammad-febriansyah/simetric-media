import { cn } from '@/lib/utils';
import type { Option } from '@/types';

/**
 * Row of pill-shaped filter buttons (BuildWithAngga style). An empty value
 * means "all".
 */
export function FilterPills({
    options,
    value,
    onChange,
    allLabel = 'Semua',
    label,
}: {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    allLabel?: string;
    /** Accessible name of the group, e.g. "Filter industri". */
    label: string;
}) {
    const items = [{ value: '', label: allLabel }, ...options];

    return (
        <div role="group" aria-label={label} className="flex flex-wrap gap-2">
            {items.map((item) => {
                const isActive = item.value === value;

                return (
                    <button
                        key={item.value || 'all'}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onChange(item.value)}
                        className={cn(
                            'rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                            isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'bg-card text-muted-foreground ring-1 ring-border hover:text-primary hover:ring-primary/30',
                        )}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
