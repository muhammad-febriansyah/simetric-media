import { Head, Link, router } from '@inertiajs/react';
import { ArrowRightIcon, NewspaperIcon } from 'lucide-react';
import { ArticleCard } from '@/components/site/article-card';
import { FilterPills } from '@/components/site/filter-pills';
import { SiteEmpty } from '@/components/site/site-empty';
import { SitePagination } from '@/components/site/site-pagination';
import { Badge } from '@/components/ui/badge';
import { home } from '@/routes';
import { index, show } from '@/routes/insights';
import type { Article, Paginated } from '@/types';

type Props = {
    articles: Paginated<Article>;
    filters: { category: string };
    categories: string[];
};

/** Newest insight shown large at the top of the first, unfiltered page. */
function FeaturedArticle({ article }: { article: Article }) {
    return (
        <Link
            href={show(article.slug)}
            className="group flex rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <div className="site-card site-card-interactive grid w-full gap-6 p-6 md:p-7.5 lg:grid-cols-2 lg:gap-10">
                {article.cover_image_url ? (
                    <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="aspect-video w-full rounded-2xl object-cover"
                    />
                ) : (
                    <div className="flex aspect-video items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                        <NewspaperIcon className="size-14" />
                    </div>
                )}
                <div className="flex flex-col justify-center gap-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-success">
                            Insight terbaru
                        </span>
                        {article.category && (
                            <Badge variant="secondary">
                                {article.category}
                            </Badge>
                        )}
                        {article.published_at_label && (
                            <span>{article.published_at_label}</span>
                        )}
                    </div>
                    <h2 className="text-2xl leading-tight font-bold group-hover:text-primary md:text-3xl">
                        {article.title}
                    </h2>
                    {article.excerpt && (
                        <p className="line-clamp-3 leading-relaxed text-muted-foreground">
                            {article.excerpt}
                        </p>
                    )}
                    <span className="flex items-center gap-1.5 font-semibold text-primary">
                        Baca insight
                        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function InsightIndex({ articles, filters, categories }: Props) {
    const { current_page: currentPage, last_page: lastPage } = articles.meta;
    const showFeatured =
        currentPage === 1 && !filters.category && articles.data.length > 1;
    const [featured, ...rest] = articles.data;
    const gridArticles = showFeatured ? rest : articles.data;

    const visit = (query: { category?: string; page?: number }) => {
        const category = query.category ?? filters.category;

        router.get(
            index.url(),
            { category: category || undefined, page: query.page },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Insight" />

            {categories.length > 0 && (
                <FilterPills
                    label="Filter kategori"
                    options={categories.map((category) => ({
                        value: category,
                        label: category,
                    }))}
                    value={filters.category}
                    onChange={(category) => visit({ category })}
                />
            )}

            {articles.data.length === 0 ? (
                <SiteEmpty
                    icon={NewspaperIcon}
                    title="Belum ada insight"
                    description="Artikel baru akan segera hadir."
                />
            ) : (
                <>
                    {showFeatured && <FeaturedArticle article={featured} />}
                    {gridArticles.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {gridArticles.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <SitePagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={(page) => visit({ page })}
            />
        </>
    );
}

InsightIndex.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Insight', href: index() },
    ],
    eyebrow: 'Insight',
    title: 'Insight untuk Pemilik Bisnis',
    description:
        'Panduan praktis seputar strategi, teknologi, dan operasional untuk pemilik bisnis dan manajer.',
};
