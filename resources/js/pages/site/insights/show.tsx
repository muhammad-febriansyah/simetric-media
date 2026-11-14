import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    CalendarIcon,
    ChevronRightIcon,
    UserIcon,
} from 'lucide-react';
import { SitePageHeader } from '@/components/site/site-page-header';
import { RichText } from '@/components/rich-text';
import { ArticleCard } from '@/components/site/article-card';
import { DetailSection } from '@/components/site/detail-section';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { create as consultationCreate } from '@/routes/consultation';
import { index, show } from '@/routes/insights';
import { show as showService } from '@/routes/services';
import type { Article } from '@/types';

type Props = {
    article: Article;
    relatedArticles: Article[];
};

export default function InsightShow({ article, relatedArticles }: Props) {
    return (
        <>
            <Head title={article.meta_title ?? article.title}>
                {(article.meta_description ?? article.excerpt) && (
                    <meta
                        name="description"
                        content={
                            article.meta_description ?? article.excerpt ?? ''
                        }
                    />
                )}
            </Head>

            <SitePageHeader
                breadcrumbs={[
                    { title: 'Beranda', href: home() },
                    { title: 'Insight', href: index() },
                    { title: article.title, href: show(article.slug) },
                ]}
                eyebrow={article.category ?? 'Insight'}
                title={article.title}
                description={article.excerpt ?? undefined}
            >
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    {article.author && (
                        <span className="flex items-center gap-1.5">
                            <UserIcon className="size-4" />
                            {article.author.name}
                        </span>
                    )}
                    {article.published_at_label && (
                        <span className="flex items-center gap-1.5">
                            <CalendarIcon className="size-4" />
                            {article.published_at_label}
                        </span>
                    )}
                </div>
            </SitePageHeader>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
                <article className="site-card overflow-hidden">
                    {article.cover_image_url && (
                        <img
                            src={article.cover_image_url}
                            alt={article.title}
                            className="aspect-video w-full object-cover"
                        />
                    )}
                    <RichText
                        html={article.body}
                        className="mx-auto max-w-3xl p-6 text-base leading-8 text-foreground/90 md:p-10 md:text-[1.0625rem]"
                    />
                </article>

                <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
                    {article.services && article.services.length > 0 && (
                        <div className="site-card flex flex-col gap-4 p-6">
                            <h2 className="text-lg font-bold">
                                Keahlian terkait
                            </h2>
                            <div className="flex flex-col gap-2">
                                {article.services.map((service) => (
                                    <Link
                                        key={service.id}
                                        href={showService(service.slug)}
                                        className="group flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-4 py-3 text-sm font-semibold transition-colors hover:bg-accent hover:text-primary"
                                    >
                                        {service.name}
                                        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-4 rounded-2xl bg-navy p-6 text-navy-foreground">
                        <span className="text-sm font-semibold text-success">
                            Konsultasi gratis
                        </span>
                        <h2 className="text-xl leading-snug font-bold">
                            Punya tantangan serupa?
                        </h2>
                        <p className="text-sm leading-relaxed text-white/70">
                            Ceritakan masalah bisnis Anda. Konsultasi awal
                            gratis dan tanpa komitmen.
                        </p>
                        <Button asChild>
                            <Link href={consultationCreate()}>
                                Konsultasi Gratis
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                    </div>
                </aside>
            </div>

            {relatedArticles.length > 0 && (
                <DetailSection eyebrow="Insight" title="Bacaan lainnya">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {relatedArticles.map((related) => (
                            <ArticleCard key={related.id} article={related} />
                        ))}
                    </div>
                </DetailSection>
            )}
        </>
    );
}

InsightShow.layout = {
    inner: true,
};
