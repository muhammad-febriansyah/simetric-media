import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LeadTrendChartComponent = lazy(
    () => import('@/components/admin/charts/lead-trend-chart'),
);
const HorizontalBarChartComponent = lazy(
    () => import('@/components/admin/charts/horizontal-bar-chart'),
);

/**
 * ApexCharts is large, so charts load in their own chunk with a skeleton meanwhile.
 */
export function LeadTrendChart(
    props: ComponentProps<typeof LeadTrendChartComponent>,
) {
    return (
        <Suspense
            fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}
        >
            <LeadTrendChartComponent {...props} />
        </Suspense>
    );
}

export function HorizontalBarChart(
    props: ComponentProps<typeof HorizontalBarChartComponent>,
) {
    return (
        <Suspense fallback={<Skeleton className="h-56 w-full rounded-xl" />}>
            <HorizontalBarChartComponent {...props} />
        </Suspense>
    );
}
