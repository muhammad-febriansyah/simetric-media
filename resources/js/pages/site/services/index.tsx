import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
import { ContentIcon } from '@/components/site/content-icon';
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
    EmptyTitle,
} from '@/components/ui/empty';
import { home } from '@/routes';
import { index, show } from '@/routes/services';
import type { Option, Service } from '@/types';

type Props = {
    services: Service[];
    pillars: Option[];
};

export default function ServiceIndex({ services, pillars }: Props) {
    const groups = pillars
        .map((pillar) => ({
            pillar,
            services: services.filter(
                (service) => service.pillar.value === pillar.value,
            ),
        }))
        .filter((group) => group.services.length > 0);

    return (
        <>
            <Head title="Layanan" />

            {groups.length === 0 && (
                <Card>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle>Layanan segera hadir</EmptyTitle>
                                <EmptyDescription>
                                    Hubungi kami untuk konsultasi kebutuhan
                                    Anda.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </CardContent>
                </Card>
            )}

            {groups.map((group) => (
                <Card key={group.pillar.value}>
                    <CardHeader>
                        <CardTitle>{group.pillar.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {group.services.map((service) => (
                            <Link
                                key={service.id}
                                href={show(service.slug)}
                                className="group flex gap-4 rounded-xl bg-muted p-5 transition-colors hover:bg-accent"
                            >
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
                                    <ContentIcon iconName={service.icon} />
                                </span>
                                <div className="flex flex-1 flex-col gap-1.5">
                                    <span className="font-semibold group-hover:text-primary">
                                        {service.name}
                                    </span>
                                    {service.headline && (
                                        <CardDescription>
                                            {service.headline}
                                        </CardDescription>
                                    )}
                                </div>
                                <ArrowRightIcon className="mt-1 size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

ServiceIndex.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Layanan', href: index() },
    ],
    title: 'Layanan',
    description:
        'Pendampingan lengkap: dari konsultasi dan strategi, desain, pengembangan, sampai implementasi dan support.',
};
