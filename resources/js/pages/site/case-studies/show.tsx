import { Head } from '@inertiajs/react';
import {
    Building2Icon,
    CalendarRangeIcon,
    CheckCircle2Icon,
    FolderKanbanIcon,
    LandmarkIcon,
    LightbulbIcon,
    SearchCheckIcon,
    SparklesIcon,
    TargetIcon,
    WrenchIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { RichText } from '@/components/rich-text';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import { index, show } from '@/routes/case-studies';
import type { CaseStudy } from '@/types';

type Props = {
    caseStudy: CaseStudy;
    relatedCaseStudies: CaseStudy[];
};

type JourneyStep = {
    title: string;
    icon: LucideIcon;
    body: string;
};

function MetaItem({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" />
            </span>
            <span className="flex flex-col">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
            </span>
        </div>
    );
}

export default function CaseStudyShow({
    caseStudy,
    relatedCaseStudies,
}: Props) {
    const journey = [
        { title: 'Tantangan', icon: TargetIcon, body: caseStudy.challenge },
        {
            title: 'Temuan assessment',
            icon: SearchCheckIcon,
            body: caseStudy.assessment,
        },
        {
            title: 'Rekomendasi',
            icon: LightbulbIcon,
            body: caseStudy.recommendation,
        },
        { title: 'Solusi', icon: WrenchIcon, body: caseStudy.solution },
    ].filter((step): step is JourneyStep => Boolean(step.body));

    return (
        <>
            <Head title={caseStudy.meta_title ?? caseStudy.title}>
                {caseStudy.meta_description || caseStudy.excerpt ? (
                    <meta
                        name="description"
                        content={
                            caseStudy.meta_description ??
                            caseStudy.excerpt ??
                            ''
                        }
                    />
                ) : null}
            </Head>

            <PageHeader
                breadcrumbs={[
                    { title: 'Beranda', href: home() },
                    { title: 'Studi Kasus', href: index() },
                    { title: caseStudy.title, href: show(caseStudy.slug) },
                ]}
                title={caseStudy.title}
                description={caseStudy.excerpt ?? undefined}
            />

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <Card className="gap-0 overflow-hidden py-0 lg:col-span-2">
                    {caseStudy.cover_image_url ? (
                        <img
                            src={caseStudy.cover_image_url}
                            alt={caseStudy.title}
                            className="aspect-video w-full object-cover"
                        />
                    ) : (
                        <div className="flex aspect-video w-full items-center justify-center bg-accent text-accent-foreground">
                            <FolderKanbanIcon className="size-14" />
                        </div>
                    )}
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan proyek</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        <MetaItem
                            icon={Building2Icon}
                            label="Klien"
                            value={caseStudy.client_name}
                        />
                        {caseStudy.industry && (
                            <MetaItem
                                icon={FolderKanbanIcon}
                                label="Industri"
                                value={caseStudy.industry.name}
                            />
                        )}
                        {caseStudy.organization_type && (
                            <MetaItem
                                icon={LandmarkIcon}
                                label="Tipe organisasi"
                                value={caseStudy.organization_type.label}
                            />
                        )}
                        {caseStudy.project_period && (
                            <MetaItem
                                icon={CalendarRangeIcon}
                                label="Periode"
                                value={caseStudy.project_period}
                            />
                        )}
                        {caseStudy.services &&
                            caseStudy.services.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {caseStudy.services.map((service) => (
                                        <Badge
                                            key={service.id}
                                            variant="secondary"
                                        >
                                            {service.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                    </CardContent>
                </Card>
            </div>

            {caseStudy.results.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {caseStudy.results.map((result) => (
                        <Card key={result.label}>
                            <CardContent className="flex flex-col gap-1">
                                <span className="text-2xl leading-tight font-bold text-primary md:text-3xl">
                                    {result.value}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {result.label}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Perjalanan konsultasi</CardTitle>
                    <CardDescription>
                        Bagaimana kami memahami masalah sebelum membangun
                        solusi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="flex flex-col">
                        {journey.map((step, position) => (
                            <li
                                key={step.title}
                                className="relative flex gap-5 pb-8 last:pb-0"
                            >
                                {position < journey.length - 1 && (
                                    <span className="absolute top-12 left-6 h-[calc(100%-3rem)] w-px bg-border" />
                                )}
                                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                    <step.icon className="size-5" />
                                </span>
                                <div className="flex flex-col gap-2 pt-1">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        Tahap {position + 1}
                                    </span>
                                    <h2 className="text-lg font-semibold">
                                        {step.title}
                                    </h2>
                                    <RichText
                                        html={step.body}
                                        className="text-muted-foreground"
                                    />
                                </div>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>

            {caseStudy.images && caseStudy.images.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Galeri</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {caseStudy.images.map((image) => (
                            <figure
                                key={image.id}
                                className="flex flex-col gap-2"
                            >
                                <img
                                    src={image.url}
                                    alt={image.caption ?? caseStudy.title}
                                    loading="lazy"
                                    className="aspect-video w-full rounded-xl object-cover"
                                />
                                {image.caption && (
                                    <figcaption className="text-sm text-muted-foreground">
                                        {image.caption}
                                    </figcaption>
                                )}
                            </figure>
                        ))}
                    </CardContent>
                </Card>
            )}

            {caseStudy.key_insights.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <SparklesIcon className="size-5 text-primary" />
                            Insight untuk pimpinan
                        </CardTitle>
                        <CardDescription>
                            Pelajaran strategis yang bisa diterapkan di
                            perusahaan Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {caseStudy.key_insights.map((insight) => (
                            <div
                                key={insight.title}
                                className="flex items-start gap-3 rounded-xl bg-muted p-5"
                            >
                                <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-success" />
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">
                                        {insight.title}
                                    </span>
                                    {insight.description && (
                                        <span className="text-sm text-muted-foreground">
                                            {insight.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {relatedCaseStudies.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Studi kasus lainnya</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {relatedCaseStudies.map((related) => (
                            <CaseStudyCard
                                key={related.id}
                                caseStudy={related}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}
        </>
    );
}

CaseStudyShow.layout = {
    inner: true,
};
