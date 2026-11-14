import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, CheckCircle2Icon } from 'lucide-react';
import { RichText } from '@/components/rich-text';
import { ArticleCard } from '@/components/site/article-card';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { ConsultActions } from '@/components/site/consult-actions';
import { ContentIcon } from '@/components/site/content-icon';
import { DetailSection } from '@/components/site/detail-section';
import { FaqList } from '@/components/site/faq-list';
import { SitePageHeader } from '@/components/site/site-page-header';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
import { index } from '@/routes/expertises';
import { show } from '@/routes/services';
import type { Article, CaseStudy, Faq, Service } from '@/types';

type Props = {
    service: Service;
    caseStudies: CaseStudy[];
    articles: Article[];
    faqs: Faq[];
};

export default function ServiceShow({
    service,
    caseStudies,
    articles,
    faqs,
}: Props) {
    return (
        <>
            <Head title={service.name} />

            <SitePageHeader
                breadcrumbs={[
                    { title: 'Beranda', href: home() },
                    { title: 'Keahlian', href: index() },
                    { title: service.name, href: show(service.slug) },
                ]}
                eyebrow={service.expertise?.name}
                title={service.name}
                description={service.headline ?? undefined}
            >
                <ConsultActions
                    consultLabel="Diskusikan kebutuhan Anda"
                    message={`Halo, saya ingin berdiskusi tentang layanan ${service.name}.`}
                />
            </SitePageHeader>

            <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
                <article className="site-card flex flex-col gap-6 p-6 md:p-8">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground [&_svg]:size-6">
                        <ContentIcon iconName={service.icon} />
                    </span>
                    {service.problem_statement && (
                        <p className="border-l-4 border-primary pl-4 text-lg leading-relaxed font-semibold md:text-xl">
                            {service.problem_statement}
                        </p>
                    )}
                    {service.body && (
                        <RichText
                            html={service.body}
                            className="text-muted-foreground"
                        />
                    )}
                </article>

                <aside className="site-card flex flex-col gap-5 p-6 lg:sticky lg:top-28">
                    <h2 className="text-lg font-bold">Yang Anda dapatkan</h2>
                    <ul className="flex flex-col gap-4">
                        {service.capabilities.map((capability) => (
                            <li
                                key={capability.title}
                                className="flex items-start gap-3"
                            >
                                <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-success" />
                                <span className="flex flex-col gap-0.5">
                                    <span className="text-sm font-semibold">
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
                            Konsultasi Gratis
                            <ArrowRightIcon data-icon="inline-end" />
                        </Link>
                    </Button>
                </aside>
            </div>

            {service.methodology.length > 0 && (
                <DetailSection
                    eyebrow="Metodologi"
                    title="Cara kami mengerjakannya"
                >
                    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {service.methodology.map((step, position) => (
                            <li
                                key={step.title}
                                className="site-card flex flex-col gap-3 p-6"
                            >
                                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                                    {String(position + 1).padStart(2, '0')}
                                </span>
                                <span className="text-lg font-semibold">
                                    {step.title}
                                </span>
                                {step.description && (
                                    <span className="text-sm leading-relaxed text-muted-foreground">
                                        {step.description}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </DetailSection>
            )}

            {caseStudies.length > 0 && (
                <DetailSection
                    eyebrow="Studi kasus"
                    title="Hasil nyata dari layanan ini"
                    action={
                        <Button variant="secondary" asChild>
                            <Link href={caseStudiesIndex()}>
                                Semua studi kasus
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                    }
                >
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {caseStudies.map((caseStudy) => (
                            <CaseStudyCard
                                key={caseStudy.id}
                                caseStudy={caseStudy}
                            />
                        ))}
                    </div>
                </DetailSection>
            )}

            {faqs.length > 0 && (
                <DetailSection
                    eyebrow="Tanya jawab"
                    title={`Pertanyaan seputar ${service.name}`}
                >
                    <FaqList faqs={faqs} />
                </DetailSection>
            )}

            {articles.length > 0 && (
                <DetailSection eyebrow="Insight" title="Bacaan terkait">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </DetailSection>
            )}
        </>
    );
}

ServiceShow.layout = {
    inner: true,
};
