import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, CalendarIcon, UserIcon } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { RichText } from '@/components/rich-text';
import { ArticleCard } from '@/components/site/article-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

            <PageHeader
                breadcrumbs={[
                    { title: 'Beranda', href: home() },
                    { title: 'Insight', href: index() },
                    { title: article.title, href: show(article.slug) },
                ]}
                title={article.title}
                description={article.excerpt ?? ''}
            />

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <Card className="gap-0 overflow-hidden py-0 lg:col-span-2">
                    {article.cover_image_url && (
                        <img
                            src={article.cover_image_url}
                            alt={article.title}
                            className="aspect-video w-full object-cover"
                        />
                    )}
                    <CardContent className="flex flex-col gap-6 p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {article.category && (
                                <Badge variant="secondary">
                                    {article.category}
                                </Badge>
                            )}
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
                        <RichText
                            html={article.body}
                            className="text-base text-foreground/90"
                        />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6 lg:sticky lg:top-24">
                    {article.services && article.services.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Keahlian terkait</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                {article.services.map((service) => (
                                    <Link
                                        key={service.id}
                                        href={showService(service.slug)}
                                        className="group flex items-center justify-between gap-3 rounded-xl bg-muted px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-primary"
                                    >
                                        {service.name}
                                        <ArrowRightIcon className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Punya tantangan serupa?</CardTitle>
                            <CardDescription>
                                Ceritakan masalah bisnis Anda. Konsultasi awal
                                gratis dan tanpa komitmen.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={consultationCreate()}>
                                    Konsultasi gratis
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {relatedArticles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Insight lainnya</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {relatedArticles.map((related) => (
                            <ArticleCard key={related.id} article={related} />
                        ))}
                    </CardContent>
                </Card>
            )}
        </>
    );
}

InsightShow.layout = {
    inner: true,
};
