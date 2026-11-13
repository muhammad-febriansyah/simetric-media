import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, CheckCircle2Icon } from 'lucide-react';
import { ContentIcon } from '@/components/site/content-icon';
import { Card, CardContent } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import { home } from '@/routes';
import { index, show } from '@/routes/industries';
import type { Industry } from '@/types';

export default function IndustryIndex({
    industries,
}: {
    industries: Industry[];
}) {
    return (
        <>
            <Head title="Industri" />

            {industries.length === 0 ? (
                <Card>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle>Belum ada data industri</EmptyTitle>
                                <EmptyDescription>
                                    Hubungi kami untuk mendiskusikan kebutuhan
                                    industri Anda.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {industries.map((industry) => (
                        <Link
                            key={industry.id}
                            href={show(industry.slug)}
                            className="group flex rounded-2xl"
                        >
                            <Card className="w-full transition-shadow group-hover:shadow-lg">
                                <CardContent className="flex h-full flex-col gap-4">
                                    <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                        <ContentIcon iconName={industry.icon} />
                                    </span>
                                    <h2 className="text-lg font-semibold group-hover:text-primary">
                                        {industry.name}
                                    </h2>
                                    {industry.summary && (
                                        <p className="text-sm text-muted-foreground">
                                            {industry.summary}
                                        </p>
                                    )}
                                    <ul className="flex flex-col gap-2">
                                        {industry.pain_points
                                            .slice(0, 3)
                                            .map((painPoint) => (
                                                <li
                                                    key={painPoint}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                                                    {painPoint}
                                                </li>
                                            ))}
                                    </ul>
                                    <span className="mt-auto flex items-center gap-2 pt-2 text-sm font-semibold text-primary">
                                        Lihat detail
                                        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}

IndustryIndex.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Industri', href: index() },
    ],
    title: 'Industri yang Kami Layani',
    description:
        'Setiap industri punya tantangan berbeda. Kami mulai dengan memahami cara kerja bisnis Anda.',
};
