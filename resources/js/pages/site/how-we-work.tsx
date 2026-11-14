import { Head } from '@inertiajs/react';
import { ClockIcon, PackageCheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { home, howWeWork } from '@/routes';
import type { ProcessStep } from '@/types';

export default function HowWeWork({ process }: { process: ProcessStep[] }) {
    return (
        <>
            <Head title="Cara Kami Bekerja" />

            <div className="flex flex-col gap-6">
                {process.map((step, position) => (
                    <Card key={step.title}>
                        <CardContent className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
                            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                                {position + 1}
                            </span>
                            <div className="flex flex-1 flex-col gap-3">
                                <h2 className="text-xl font-semibold">
                                    {step.title}
                                </h2>
                                <p className="text-muted-foreground">
                                    {step.description}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <Badge
                                        variant="secondary"
                                        className="h-auto text-left whitespace-normal"
                                    >
                                        <PackageCheckIcon />
                                        {step.deliverable}
                                    </Badge>
                                    <Badge variant="outline">
                                        <ClockIcon />
                                        {step.duration}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}

HowWeWork.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Cara Kami Bekerja', href: howWeWork() },
    ],
    title: 'Cara Kami Bekerja',
    description:
        'Tujuh tahap pendampingan dari konsultasi awal sampai solusi berjalan di perusahaan Anda. Setiap tahap punya hasil yang bisa Anda lihat.',
};
