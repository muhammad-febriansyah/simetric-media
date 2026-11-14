import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import { SitePageHeader } from '@/components/site/site-page-header';
import { ArticleCard } from '@/components/site/article-card';
import { ContentIcon } from '@/components/site/content-icon';
import { SectionHeading } from '@/components/site/section-heading';
import { Button } from '@/components/ui/button';
import { SiteEmpty } from '@/components/site/site-empty';
import { home } from '@/routes';
import { index } from '@/routes/expertises';
import { index as insightsIndex } from '@/routes/insights';
import { show as showService } from '@/routes/services';
import type { Article, Expertise } from '@/types';

type Props = {
    intro: { title: string; description: string };
    expertises: Expertise[];
    articles: Article[];
};

export default function ExpertiseIndex({ intro, expertises, articles }: Props) {
    return (
        <>
            <Head title="Keahlian">
                <meta name="description" content={intro.description} />
            </Head>

            <SitePageHeader
                breadcrumbs={[
                    { title: 'Beranda', href: home() },
                    { title: 'Keahlian', href: index() },
                ]}
                eyebrow="Keahlian kami"
                title={intro.title}
                description={intro.description}
            />

            {expertises.length === 0 && (
                <SiteEmpty
                    title="Keahlian segera hadir"
                    description="Hubungi kami untuk konsultasi kebutuhan Anda."
                />
            )}

            {expertises.map((expertise) => (
                <section
                    key={expertise.id}
                    id={expertise.slug}
                    aria-labelledby={`expertise-${expertise.slug}`}
                    className="site-card grid scroll-mt-28 gap-6 p-6 md:p-8 lg:grid-cols-[1fr_2fr] lg:gap-10"
                >
                    <div className="flex flex-col gap-3">
                        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground [&_svg]:size-6">
                            <ContentIcon iconName={expertise.icon} />
                        </span>
                        <h2
                            id={`expertise-${expertise.slug}`}
                            className="text-2xl font-bold"
                        >
                            {expertise.name}
                        </h2>
                        {expertise.description && (
                            <p className="leading-relaxed text-muted-foreground">
                                {expertise.description}
                            </p>
                        )}
                        <span className="text-sm font-semibold text-success">
                            {expertise.services?.length ?? 0} layanan
                        </span>
                    </div>
                    <div className="grid content-start gap-4 sm:grid-cols-2">
                        {(expertise.services ?? []).map((service) => (
                            <Link
                                key={service.id}
                                href={showService(service.slug)}
                                className="group flex items-center gap-4 rounded-2xl bg-muted/60 p-4 transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
                                    <ContentIcon iconName={service.icon} />
                                </span>
                                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <span className="font-semibold group-hover:text-primary">
                                        {service.name}
                                    </span>
                                    {service.headline && (
                                        <span className="text-sm text-muted-foreground">
                                            {service.headline}
                                        </span>
                                    )}
                                </span>
                                <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                            </Link>
                        ))}
                    </div>
                </section>
            ))}

            {articles.length > 0 && (
                <section className="flex flex-col gap-8 pt-8">
                    <SectionHeading
                        eyebrow="Insight"
                        title="Insight dari tim kami"
                        action={
                            <Button variant="secondary" asChild>
                                <Link href={insightsIndex()}>
                                    Semua insight
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Link>
                            </Button>
                        }
                    />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

ExpertiseIndex.layout = {
    inner: true,
};
