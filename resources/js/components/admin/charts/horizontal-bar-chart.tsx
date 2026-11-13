import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import {
    baseChartOptions,
    chartTokens,
} from '@/components/admin/charts/chart-theme';
import type { ChartPoint } from '@/components/admin/charts/lead-trend-chart';

type HorizontalBarChartProps = {
    data: ChartPoint[];
    seriesName: string;
    /** Text after each value in labels and tooltips, e.g. "lead". */
    unit: string;
};

/**
 * Horizontal bar chart for a single series over named categories. Values are
 * direct-labeled at the bar end in the text color (not the series color).
 */
export default function HorizontalBarChart({
    data,
    seriesName,
    unit,
}: HorizontalBarChartProps) {
    const tokens = chartTokens();
    const base = baseChartOptions(tokens);
    const height = Math.max(160, data.length * 44 + 30);
    const maxValue = Math.max(...data.map((point) => point.total), 1);
    // Leave room after the longest bar for its value label.
    const axisMax = Math.max(4, Math.ceil((maxValue * 1.2) / 2) * 2);

    const options: ApexOptions = {
        ...base,
        chart: { ...base.chart, type: 'bar' },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                borderRadiusApplication: 'end',
                barHeight: '58%',
                dataLabels: { position: 'top' },
            },
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            offsetX: 8,
            style: { fontSize: '12px', fontWeight: 600, colors: [tokens.text] },
            formatter: (value: number) => String(value),
        },
        grid: {
            ...base.grid,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: false } },
            padding: { left: 12, right: 12 },
        },
        xaxis: {
            ...base.xaxis,
            categories: data.map((point) => point.label),
            min: 0,
            max: axisMax,
            tickAmount: Math.min(axisMax, 4),
            labels: {
                style: { fontSize: '12px', colors: tokens.muted },
                formatter: (value: string) => String(Math.round(Number(value))),
            },
        },
        yaxis: {
            labels: {
                minWidth: 96,
                maxWidth: 200,
                align: 'left',
                style: { fontSize: '12px', colors: tokens.text },
            },
        },
        tooltip: {
            ...base.tooltip,
            y: { formatter: (value: number) => `${value} ${unit}` },
        },
    };

    return (
        <Chart
            type="bar"
            height={height}
            options={options}
            series={[
                { name: seriesName, data: data.map((point) => point.total) },
            ]}
        />
    );
}
