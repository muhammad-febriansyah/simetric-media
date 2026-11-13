import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    AlertTriangleIcon,
    ArrowDownRightIcon,
    ArrowRightIcon,
    ArrowUpRightIcon,
    BarChart3Icon,
    CheckCircle2Icon,
    InboxIcon,
    MinusIcon,
    TargetIcon,
    TrendingUpIcon,
    UserRoundXIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import {
    HorizontalBarChart,
    LeadTrendChart,
} from '@/components/admin/charts/lazy-charts';
import type { ChartPoint } from '@/components/admin/charts/lead-trend-chart';
import { LeadStatusBadge } from '@/components/admin/status-badges';
import { DataTable } from '@/components/data-table/data-table';
import { RowActions } from '@/components/data-table/row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as leadsIndex, show as showLead } from '@/routes/admin/leads';
import type { Lead, Option } from '@/types';

type Props = {
    kpis: {
        leadsThisMonth: { value: number; previous: number };
        activeLeads: { value: number };
        conversionRate: { value: number; won: number; closed: number };
        unassignedLeads: { value: number };
    };
    trend: {
        monthly: ChartPoint[];
        daily: ChartPoint[];
    };
    leadsByStatus: (Option & { total: number })[];
    leadsByProblemArea: ChartPoint[];
    leadsByIndustry: ChartPoint[];
    needsAttention: Lead[];
    latestLeads: Lead[];
    content: { label: string; published: number; draft: number }[];
};

type TrendRange = 'monthly' | 'daily';

const latestLeadColumns: ColumnDef<Lead>[] = [
    {
        accessorKey: 'name',
        header: 'Nama',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.name}</span>
                <span className="text-xs text-muted-foreground">
                    {row.original.company_name}
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
        accessorKey: 'created_at_label',
        header: 'Masuk',
    },
    {
        id: 'actions',
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => <RowActions viewHref={showLead(row.original.id)} />,
    },
];

function percentChange(current: number, previous: number): number | null {
    if (previous === 0) {
        return current === 0 ? 0 : null;
    }

    return Math.round(((current - previous) / previous) * 100);
}

function KpiCard({
    icon: Icon,
    label,
    value,
    footer,
    tone = 'default',
    href,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
    footer: React.ReactNode;
    tone?: 'default' | 'warning';
    href?: NonNullable<Parameters<typeof Link>[0]['href']>;
}) {
    const body = (
        <Card
            className={cn(
                'h-full gap-4 transition-shadow',
                href && 'hover:shadow-md',
                tone === 'warning' && 'ring-1 ring-destructive/30',
            )}
        >
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                        {label}
                    </span>
                    <span
                        className={cn(
                            'flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground',
                            tone === 'warning' &&
                                'bg-destructive/10 text-destructive',
                        )}
                    >
                        <Icon className="size-5" />
                    </span>
                </div>
                <span className="text-3xl font-bold tracking-tight">
                    {value}
                </span>
                <div className="text-xs text-muted-foreground">{footer}</div>
            </CardContent>
        </Card>
    );

    return href ? (
        <Link href={href} className="rounded-2xl">
            {body}
        </Link>
    ) : (
        body
    );
}

function TrendDelta({
    current,
    previous,
}: {
    current: number;
    previous: number;
}) {
    const change = percentChange(current, previous);

    if (change === null) {
        return (
            <span className="flex items-center gap-1">
                <ArrowUpRightIcon className="size-3.5 text-success" />
                Naik dari 0 lead bulan lalu
            </span>
        );
    }

    if (change === 0) {
        return (
            <span className="flex items-center gap-1">
                <MinusIcon className="size-3.5" />
                Sama dengan bulan lalu ({previous})
            </span>
        );
    }

    const isUp = change > 0;
    const Icon = isUp ? ArrowUpRightIcon : ArrowDownRightIcon;

    return (
        <span className="flex items-center gap-1">
            <Icon
                className={cn(
                    'size-3.5',
                    isUp ? 'text-success' : 'text-destructive',
                )}
            />
            <span
                className={cn(
                    'font-semibold',
                    isUp ? 'text-success' : 'text-destructive',
                )}
            >
                {isUp ? '+' : ''}
                {change}%
            </span>
            dari bulan lalu ({previous})
        </span>
    );
}

function ChartEmpty({ title }: { title: string }) {
    return (
        <Empty className="py-10">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <BarChart3Icon />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>
                    Grafik tampil setelah ada lead dari form konsultasi.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

export default function Dashboard({
    kpis,
    trend,
    leadsByStatus,
    leadsByProblemArea,
    leadsByIndustry,
    needsAttention,
    latestLeads,
    content,
}: Props) {
    const [range, setRange] = useState<TrendRange>('monthly');
    const trendData = trend[range];
    const trendTotal = trendData.reduce((sum, point) => sum + point.total, 0);
    const hasLeads = leadsByStatus.some((status) => status.total > 0);
    const problemAreas = leadsByProblemArea.filter((area) => area.total > 0);

    return (
        <>
            <Head title="Dashboard" />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    icon={InboxIcon}
                    label="Lead bulan ini"
                    value={String(kpis.leadsThisMonth.value)}
                    footer={
                        <TrendDelta
                            current={kpis.leadsThisMonth.value}
                            previous={kpis.leadsThisMonth.previous}
                        />
                    }
                    href={leadsIndex()}
                />
                <KpiCard
                    icon={TrendingUpIcon}
                    label="Lead dalam proses"
                    value={String(kpis.activeLeads.value)}
                    footer="Belum Deal atau Tidak Lanjut"
                    href={leadsIndex()}
                />
                <KpiCard
                    icon={TargetIcon}
                    label="Tingkat konversi"
                    value={`${kpis.conversionRate.value}%`}
                    footer={
                        kpis.conversionRate.closed > 0
                            ? `${kpis.conversionRate.won} deal dari ${kpis.conversionRate.closed} lead selesai`
                            : 'Belum ada lead yang selesai'
                    }
                />
                <KpiCard
                    icon={UserRoundXIcon}
                    label="Lead tanpa PIC"
                    value={String(kpis.unassignedLeads.value)}
                    tone={
                        kpis.unassignedLeads.value > 0 ? 'warning' : 'default'
                    }
                    footer={
                        kpis.unassignedLeads.value > 0
                            ? 'Segera tentukan PIC agar lead tidak terlewat'
                            : 'Semua lead aktif sudah punya PIC'
                    }
                    href={leadsIndex()}
                />
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-col gap-1.5">
                            <CardTitle>Tren lead masuk</CardTitle>
                            <CardDescription>
                                <span className="font-semibold text-foreground">
                                    {trendTotal} lead
                                </span>{' '}
                                {range === 'monthly'
                                    ? 'dalam 6 bulan terakhir'
                                    : 'dalam 30 hari terakhir'}
                            </CardDescription>
                        </div>
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            size="sm"
                            value={range}
                            onValueChange={(value) =>
                                value && setRange(value as TrendRange)
                            }
                            aria-label="Rentang waktu"
                        >
                            <ToggleGroupItem value="monthly" className="px-3">
                                6 bulan
                            </ToggleGroupItem>
                            <ToggleGroupItem value="daily" className="px-3">
                                30 hari
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </CardHeader>
                    <CardContent>
                        {hasLeads ? (
                            <LeadTrendChart key={range} data={trendData} />
                        ) : (
                            <ChartEmpty title="Belum ada lead" />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Posisi lead</CardTitle>
                        <CardDescription>
                            Jumlah lead di setiap tahap penjualan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasLeads ? (
                            <HorizontalBarChart
                                data={leadsByStatus.map((status) => ({
                                    label: status.label,
                                    total: status.total,
                                }))}
                                seriesName="Jumlah lead"
                                unit="lead"
                            />
                        ) : (
                            <ChartEmpty title="Belum ada lead" />
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Masalah yang paling sering</CardTitle>
                        <CardDescription>
                            Area masalah yang dipilih calon klien.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {problemAreas.length > 0 ? (
                            <HorizontalBarChart
                                data={problemAreas}
                                seriesName="Jumlah lead"
                                unit="lead"
                            />
                        ) : (
                            <ChartEmpty title="Belum ada data" />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lead per industri</CardTitle>
                        <CardDescription>
                            5 industri teratas, sisanya digabung.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {leadsByIndustry.length > 0 ? (
                            <HorizontalBarChart
                                data={leadsByIndustry}
                                seriesName="Jumlah lead"
                                unit="lead"
                            />
                        ) : (
                            <ChartEmpty title="Belum ada data" />
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div className="flex flex-col gap-1.5">
                            <CardTitle>Lead terbaru</CardTitle>
                            <CardDescription>
                                5 permintaan konsultasi terakhir.
                            </CardDescription>
                        </div>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={leadsIndex()}>
                                Semua lead
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={latestLeadColumns}
                            data={latestLeads}
                            showPagination={false}
                            emptyTitle="Belum ada lead"
                            emptyDescription="Permintaan dari form konsultasi akan tampil di sini."
                        />
                    </CardContent>
                </Card>
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangleIcon className="size-5 text-destructive" />
                                Perlu ditindaklanjuti
                            </CardTitle>
                            <CardDescription>
                                Lead baru tanpa PIC atau lebih dari 1 hari belum
                                diproses.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {needsAttention.length === 0 ? (
                                <Empty className="py-8">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <CheckCircle2Icon />
                                        </EmptyMedia>
                                        <EmptyTitle>Semua aman</EmptyTitle>
                                        <EmptyDescription>
                                            Tidak ada lead yang tertunda.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {needsAttention.map((lead) => (
                                        <li key={lead.id}>
                                            <Link
                                                href={showLead(lead.id)}
                                                className="flex items-center justify-between gap-3 rounded-xl bg-muted px-4 py-3 transition-colors hover:bg-accent"
                                            >
                                                <span className="flex min-w-0 flex-col">
                                                    <span className="truncate text-sm font-semibold">
                                                        {lead.name}
                                                    </span>
                                                    <span className="truncate text-xs text-muted-foreground">
                                                        {lead.company_name} ·{' '}
                                                        {lead.created_at_label}
                                                    </span>
                                                </span>
                                                {lead.assignee ? (
                                                    <Badge variant="secondary">
                                                        {lead.assignee.name}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Tanpa PIC
                                                    </Badge>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Konten website</CardTitle>
                            <CardDescription>
                                Jumlah konten terbit dan draft.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-xl border">
                                <Table>
                                    <TableHeader className="bg-muted">
                                        <TableRow className="hover:bg-muted">
                                            <TableHead>Konten</TableHead>
                                            <TableHead className="text-right">
                                                Terbit
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Draft
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {content.map((row) => (
                                            <TableRow key={row.label}>
                                                <TableCell className="font-medium">
                                                    {row.label}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {row.published}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {row.draft}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
    title: 'Dashboard',
    description: 'Ringkasan lead konsultasi dan konten website.',
};
