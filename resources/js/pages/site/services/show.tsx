import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, CheckCircle2Icon } from 'lucide-react';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { ContentIcon } from '@/components/site/content-icon';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { home } from '@/routes';
import { create as consultationCreate } from '@/routes/consultation';
import { index, show } from '@/routes/services';
import type { CaseStudy, Service } from '@/types';

type Props = {
    service: Service;
    caseStudies: CaseStudy[];
};

export default function ServiceShow({ service, caseStudies }: Props) {
    const pageHeader = {
        breadcrumbs: [
            { title: 'Beranda', href: home() },
            { title: 'Layanan', href: index() },
            { title: service.name, href: show(service.slug) },
        ],
        title: service.name,
        description: service.headline ?? service.pillar.label,
    };

    return (
        <>
            <Head title={service.name} />

            <PageHeader {...pageHeader} />

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <ContentIcon iconName={service.icon} />
                            </span>
                            <Badge variant="secondary">
                                {service.pillar.label}
                            </Badge>
                        </div>
                        {service.problem_statement && (
                            <p className="text-lg font-medium">
                                {service.problem_statement}
                            </p>
                        )}
                        {service.body &&
                            service.body !== service.problem_statement && (
                                <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                                    {service.body}
                                </p>
                            )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Yang Anda dapatkan</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <ul className="flex flex-col gap-4">
                            {service.capabilities.map((capability) => (
                                <li
                                    key={capability.title}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                                    <span className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">
                                            {capability.title}
                                        </span>
                                        {capability.description && (
                                            <span className="text-sm text-muted-foreground">
                                                {capability.description}
                                            </span>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <Button asChild>
                            <Link href={consultationCreate()}>
                                Diskusikan kebutuhan Anda
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {service.methodology.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Metodologi kami</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {service.methodology.map((step, position) => (
                            <div
                                key={step.title}
                                className="flex flex-col gap-2 rounded-xl bg-muted p-5"
                            >
                                <span className="text-2xl font-bold text-primary/30">
                                    {String(position + 1).padStart(2, '0')}
                                </span>
                                <span className="font-semibold">
                                    {step.title}
                                </span>
                                {step.description && (
                                    <span className="text-sm text-muted-foreground">
                                        {step.description}
                                    </span>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {caseStudies.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Studi kasus terkait</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {caseStudies.map((caseStudy) => (
                            <CaseStudyCard
                                key={caseStudy.id}
                                caseStudy={caseStudy}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}
        </>
    );
}

ServiceShow.layout = {
    inner: true,
};
