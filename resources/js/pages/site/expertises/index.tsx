import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ArticleCard } from '@/components/site/article-card';
import { ContentIcon } from '@/components/site/content-icon';
import { SectionHeading } from '@/components/site/section-heading';
import { Button } from '@/components/ui/button';
import SpotlightCard from '@/components/ui/spotlight-card';
import { Card, CardContent } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
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

            <PageHeader
                breadcrumbs={[
                    { title: 'Beranda', href: home() },
                    { title: 'Keahlian', href: index() },
                ]}
                title={intro.title}
                description={intro.description}
            />

            {expertises.length === 0 && (
                <Card>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle>Keahlian segera hadir</EmptyTitle>
                                <EmptyDescription>
                                    Hubungi kami untuk konsultasi kebutuhan
                                    Anda.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </CardContent>
                </Card>
            )}

            {expertises.map((expertise) => (
                <SpotlightCard
                    key={expertise.id}
                    id={expertise.slug}
                    theme="light"
                    spotlightColor="rgba(37, 71, 249, 0.16)"
                    className="scroll-mt-28 rounded-2xl p-6 md:p-8"
                >
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="flex flex-col gap-3">
                            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <ContentIcon iconName={expertise.icon} />
                            </span>
                            <h2 className="text-xl font-semibold">
                                {expertise.name}
                            </h2>
                            {expertise.description && (
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {expertise.description}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                            {(expertise.services ?? []).map((service) => (
                                <Link
                                    key={service.id}
                                    href={showService(service.slug)}
                                    className="group flex flex-col gap-2 rounded-xl bg-muted p-5 transition-colors hover:bg-accent"
                                >
                                    <span className="flex items-start justify-between gap-3 font-semibold group-hover:text-primary">
                                        {service.name}
                                        <ArrowRightIcon className="mt-1 size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                                    </span>
                                    {service.headline && (
                                        <span className="text-sm text-muted-foreground">
                                            {service.headline}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </SpotlightCard>
            ))}

            {articles.length > 0 && (
                <section className="flex flex-col gap-6 pt-4">
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
