import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    Building2Icon,
    CalendarRangeIcon,
    FolderKanbanIcon,
    LandmarkIcon,
    LightbulbIcon,
    SearchCheckIcon,
    SparklesIcon,
    TargetIcon,
    WrenchIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SitePageHeader } from '@/components/site/site-page-header';
import { RichText } from '@/components/rich-text';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { DetailSection } from '@/components/site/detail-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { index, show } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
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

            <SitePageHeader
                breadcrumbs={[
                    { title: 'Beranda', href: home() },
                    { title: 'Studi Kasus', href: index() },
                    { title: caseStudy.title, href: show(caseStudy.slug) },
                ]}
                eyebrow={
                    caseStudy.industry
                        ? `Studi kasus · ${caseStudy.industry.name}`
                        : 'Studi kasus'
                }
                title={caseStudy.title}
                description={caseStudy.excerpt ?? undefined}
            />

            {caseStudy.results.length > 0 && (
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {caseStudy.results.map((result) => (
                        <div
                            key={result.label}
                            className="site-card flex flex-col-reverse gap-1 p-6"
                        >
                            <dt className="text-sm text-muted-foreground">
                                {result.label}
                            </dt>
                            <dd className="text-3xl leading-tight font-bold text-primary">
                                {result.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="site-card overflow-hidden">
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
                </div>

                <aside className="site-card flex flex-col gap-5 p-6 lg:sticky lg:top-28">
                    <h2 className="text-lg font-bold">Ringkasan proyek</h2>
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
                    {caseStudy.services && caseStudy.services.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {caseStudy.services.map((service) => (
                                <Badge key={service.id} variant="secondary">
                                    {service.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col gap-3 border-t border-dashed pt-5">
                        <span className="text-sm font-semibold">
                            Punya tantangan serupa?
                        </span>
                        <Button asChild>
                            <Link href={consultationCreate()}>
                                Konsultasi Gratis
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                    </div>
                </aside>
            </div>

            {journey.length > 0 && (
                <DetailSection
                    eyebrow="Perjalanan konsultasi"
                    title="Bagaimana kami memahami masalah sebelum membangun solusi"
                >
                    <ol className="site-card flex flex-col p-6 md:p-8">
                        {journey.map((step, position) => (
                            <li
                                key={step.title}
                                className="relative flex gap-5 pb-8 last:pb-0"
                            >
                                {position < journey.length - 1 && (
                                    <span className="absolute top-14 left-6 h-[calc(100%-3.5rem)] w-px border-l-2 border-dashed border-primary/20" />
                                )}
                                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
                                    <step.icon className="size-5" />
                                </span>
                                <div className="flex flex-col gap-2 pt-1">
                                    <span className="text-sm font-semibold text-success">
                                        Tahap {position + 1}
                                    </span>
                                    <h3 className="text-xl font-bold">
                                        {step.title}
                                    </h3>
                                    <RichText
                                        html={step.body}
                                        className="text-muted-foreground"
                                    />
                                </div>
                            </li>
                        ))}
                    </ol>
                </DetailSection>
            )}

            {caseStudy.images && caseStudy.images.length > 0 && (
                <DetailSection eyebrow="Galeri" title="Dokumentasi proyek">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {caseStudy.images.map((image) => (
                            <figure
                                key={image.id}
                                className="site-card flex flex-col overflow-hidden"
                            >
                                <img
                                    src={image.url}
                                    alt={image.caption ?? caseStudy.title}
                                    loading="lazy"
                                    className="aspect-video w-full object-cover"
                                />
                                {image.caption && (
                                    <figcaption className="p-4 text-sm text-muted-foreground">
                                        {image.caption}
                                    </figcaption>
                                )}
                            </figure>
                        ))}
                    </div>
                </DetailSection>
            )}

            {caseStudy.key_insights.length > 0 && (
                <DetailSection
                    eyebrow="Insight untuk pimpinan"
                    title="Pelajaran yang bisa diterapkan di perusahaan Anda"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        {caseStudy.key_insights.map((insight) => (
                            <div
                                key={insight.title}
                                className="site-card flex items-start gap-4 p-6"
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                    <SparklesIcon className="size-5" />
                                </span>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">
                                        {insight.title}
                                    </span>
                                    {insight.description && (
                                        <span className="text-sm leading-relaxed text-muted-foreground">
                                            {insight.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </DetailSection>
            )}

            {relatedCaseStudies.length > 0 && (
                <DetailSection
                    eyebrow="Studi kasus"
                    title="Studi kasus lainnya"
                >
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {relatedCaseStudies.map((related) => (
                            <CaseStudyCard
                                key={related.id}
                                caseStudy={related}
                            />
                        ))}
                    </div>
                </DetailSection>
            )}
        </>
    );
}

CaseStudyShow.layout = {
    inner: true,
};
