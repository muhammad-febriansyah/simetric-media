import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import {
    baseChartOptions,
    chartTokens,
} from '@/components/admin/charts/chart-theme';

export type ChartPoint = {
    label: string;
    total: number;
};

/**
 * Area chart of new leads over time (single series, so no legend).
 */
export default function LeadTrendChart({ data }: { data: ChartPoint[] }) {
    const tokens = chartTokens();
    const base = baseChartOptions(tokens);
    const maxValue = Math.max(...data.map((point) => point.total), 0);

    const options: ApexOptions = {
        ...base,
        chart: { ...base.chart, type: 'area' },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 0,
                opacityFrom: 0.28,
                opacityTo: 0,
                stops: [0, 95],
            },
        },
        markers: {
            size: 0,
            strokeColors: tokens.card,
            strokeWidth: 2,
            hover: { size: 6 },
        },
        xaxis: {
            ...base.xaxis,
            categories: data.map((point) => point.label),
            tickAmount: Math.min(data.length, 8),
            tooltip: { enabled: false },
            crosshairs: {
                stroke: { color: tokens.border, width: 1, dashArray: 0 },
            },
        },
        yaxis: {
            min: 0,
            max: maxValue < 4 ? 4 : undefined,
            forceNiceScale: true,
            labels: {
                style: { fontSize: '12px', colors: tokens.muted },
                formatter: (value: number) => String(Math.round(value)),
            },
        },
        tooltip: {
            ...base.tooltip,
            y: {
                formatter: (value: number) => `${value} lead`,
                title: { formatter: () => 'Lead masuk' },
            },
        },
    };

    return (
        <Chart
            type="area"
            height={300}
            options={options}
            series={[
                { name: 'Lead masuk', data: data.map((point) => point.total) },
            ]}
        />
    );
}
