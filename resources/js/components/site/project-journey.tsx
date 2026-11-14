import type { LucideIcon } from 'lucide-react';
import {
    CheckIcon,
    ClockIcon,
    CodeIcon,
    GraduationCapIcon,
    LifeBuoyIcon,
    MapIcon,
    MessagesSquareIcon,
    PenToolIcon,
    SearchCheckIcon,
} from 'lucide-react';
import { AnimatedList } from '@/components/ui/animated-list';
import { cn } from '@/lib/utils';
import type { ProcessStep } from '@/types';

/** One icon per step of the standard 7-step process, in order. */
const STEP_ICONS: LucideIcon[] = [
    MessagesSquareIcon,
    SearchCheckIcon,
    MapIcon,
    PenToolIcon,
    CodeIcon,
    GraduationCapIcon,
    LifeBuoyIcon,
];

/**
 * Hero visual: the consulting process shown as a project feed that fills up
 * step by step (Magic UI "Animated List"), from first conversation to support.
 */
export function ProjectJourney({ steps }: { steps: ProcessStep[] }) {
    return (
        <div className="relative flex h-[30rem] flex-col gap-5 overflow-hidden rounded-3xl border bg-card/70 p-5 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                    <span className="font-semibold">
                        Perjalanan proyek Anda
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Dari konsultasi pertama sampai solusi berjalan
                    </span>
                </div>
                <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {steps.length} tahap
                </span>
            </div>

            <AnimatedList>
                {steps.map((step, position) => {
                    const isLast = position === steps.length - 1;
                    const Icon = isLast
                        ? CheckIcon
                        : (STEP_ICONS[position] ?? CheckIcon);

                    return (
                        <div
                            key={step.title}
                            className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.04)]"
                        >
                            <span
                                className={cn(
                                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                                    isLast
                                        ? 'bg-success text-success-foreground'
                                        : 'bg-accent text-accent-foreground',
                                )}
                            >
                                <Icon className="size-5" />
                            </span>
                            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-semibold text-primary">
                                        Tahap {position + 1}
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span className="flex items-center gap-1 truncate">
                                        <ClockIcon className="size-3 shrink-0" />
                                        {step.duration}
                                    </span>
                                </div>
                                <span className="truncate font-semibold">
                                    {step.title}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {step.deliverable}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </AnimatedList>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 rounded-b-3xl bg-gradient-to-t from-card" />
        </div>
    );
}
