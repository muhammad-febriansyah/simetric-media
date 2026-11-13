import type { ApexOptions } from 'apexcharts';

export type ChartTokens = {
    primary: string;
    text: string;
    muted: string;
    border: string;
    card: string;
};

function cssVar(name: string, fallback: string): string {
    if (typeof window === 'undefined') {
        return fallback;
    }

    return (
        getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim() || fallback
    );
}

/**
 * Chart colors read from the design tokens in app.css, so charts follow the theme.
 */
export function chartTokens(): ChartTokens {
    return {
        primary: cssVar('--primary', '#2547f9'),
        text: cssVar('--foreground', '#34364a'),
        muted: cssVar('--muted-foreground', '#7a7d92'),
        border: cssVar('--border', '#e5e9f2'),
        card: cssVar('--card', '#ffffff'),
    };
}

/**
 * Shared ApexCharts options: Poppins, no toolbar, recessive grid and axes,
 * light tooltip. Individual charts extend these.
 */
export function baseChartOptions(tokens: ChartTokens): ApexOptions {
    return {
        chart: {
            fontFamily: 'Poppins, ui-sans-serif, system-ui, sans-serif',
            foreColor: tokens.muted,
            toolbar: { show: false },
            zoom: { enabled: false },
            parentHeightOffset: 0,
            animations: { enabled: true, speed: 400 },
        },
        colors: [tokens.primary],
        dataLabels: { enabled: false },
        grid: {
            borderColor: tokens.border,
            strokeDashArray: 4,
            padding: { left: 8, right: 8 },
        },
        legend: { show: false },
        tooltip: {
            theme: 'light',
            style: { fontSize: '12px' },
        },
        states: {
            hover: { filter: { type: 'darken' } },
            active: { filter: { type: 'none' } },
        },
        xaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { fontSize: '12px', colors: tokens.muted } },
        },
        yaxis: {
            labels: { style: { fontSize: '12px', colors: tokens.muted } },
        },
    };
}
