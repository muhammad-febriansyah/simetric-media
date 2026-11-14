import type { LucideIcon } from 'lucide-react';
import {
    DatabaseIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    LayoutDashboardIcon,
    MessageCircleIcon,
    SmartphoneIcon,
} from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { useRef } from 'react';
import { BrandMark } from '@/components/brand-mark';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { cn } from '@/lib/utils';

function DiagramNode({
    ref,
    label,
    children,
    className,
}: {
    ref: Ref<HTMLDivElement>;
    label: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className="flex w-20 flex-col items-center gap-2 text-center sm:w-28">
            <div
                ref={ref}
                className={cn(
                    'relative z-10 flex size-12 items-center justify-center rounded-full border bg-card shadow-sm',
                    className,
                )}
            >
                {children}
            </div>
            <span className="text-xs leading-tight text-muted-foreground">
                {label}
            </span>
        </div>
    );
}

function NodeIcon({ icon: Icon }: { icon: LucideIcon }) {
    return <Icon className="size-5 text-foreground" />;
}

/**
 * Integration story (Magic UI "Animated Beam"): the systems a company already
 * uses flow into one application, which feeds dashboards, reports and field apps.
 */
export function IntegrationDiagram() {
    const containerRef = useRef<HTMLDivElement>(null);
    const spreadsheetRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const accountingRef = useRef<HTMLDivElement>(null);
    const hubRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const mobileRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-2xl bg-card px-4 py-10 ring-1 ring-border sm:px-10"
        >
            <div className="flex flex-col gap-8">
                <DiagramNode ref={spreadsheetRef} label="Spreadsheet">
                    <NodeIcon icon={FileSpreadsheetIcon} />
                </DiagramNode>
                <DiagramNode ref={chatRef} label="WhatsApp">
                    <NodeIcon icon={MessageCircleIcon} />
                </DiagramNode>
                <DiagramNode ref={accountingRef} label="Software akuntansi">
                    <NodeIcon icon={DatabaseIcon} />
                </DiagramNode>
            </div>

            <DiagramNode
                ref={hubRef}
                label="Aplikasi Anda"
                className="size-16 p-2.5"
            >
                <BrandMark className="size-full" />
            </DiagramNode>

            <div className="flex flex-col gap-8">
                <DiagramNode ref={dashboardRef} label="Dashboard manajemen">
                    <NodeIcon icon={LayoutDashboardIcon} />
                </DiagramNode>
                <DiagramNode ref={reportRef} label="Laporan otomatis">
                    <NodeIcon icon={FileTextIcon} />
                </DiagramNode>
                <DiagramNode ref={mobileRef} label="Aplikasi tim lapangan">
                    <NodeIcon icon={SmartphoneIcon} />
                </DiagramNode>
            </div>

            <AnimatedBeam
                className="text-foreground"
                containerRef={containerRef}
                fromRef={spreadsheetRef}
                toRef={hubRef}
                curvature={-60}
            />
            <AnimatedBeam
                className="text-foreground"
                containerRef={containerRef}
                fromRef={chatRef}
                toRef={hubRef}
                delay={0.4}
            />
            <AnimatedBeam
                className="text-foreground"
                containerRef={containerRef}
                fromRef={accountingRef}
                toRef={hubRef}
                curvature={60}
                delay={0.8}
            />
            <AnimatedBeam
                className="text-foreground"
                containerRef={containerRef}
                fromRef={hubRef}
                toRef={dashboardRef}
                curvature={-60}
                delay={1.6}
            />
            <AnimatedBeam
                className="text-foreground"
                containerRef={containerRef}
                fromRef={hubRef}
                toRef={reportRef}
                delay={2}
            />
            <AnimatedBeam
                className="text-foreground"
                containerRef={containerRef}
                fromRef={hubRef}
                toRef={mobileRef}
                curvature={60}
                delay={2.4}
            />
        </div>
    );
}
