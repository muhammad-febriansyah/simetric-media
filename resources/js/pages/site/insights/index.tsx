import { Head, router } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon, NewspaperIcon } from 'lucide-react';
import { ArticleCard } from '@/components/site/article-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { home } from '@/routes';
import { index } from '@/routes/insights';
import type { Article, Paginated } from '@/types';

type Props = {
    articles: Paginated<Article>;
    filters: { category: string };
    categories: string[];
};

const ALL = 'all';

export default function InsightIndex({ articles, filters, categories }: Props) {
    const { current_page: currentPage, last_page: lastPage } = articles.meta;

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
                <Card>
                    <CardContent>
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            value={filters.category || ALL}
                            onValueChange={(value) =>
                                visit({
                                    category:
                                        !value || value === ALL ? '' : value,
                                })
                            }
                            className="flex-wrap"
                            aria-label="Filter kategori"
                        >
                            <ToggleGroupItem value={ALL}>Semua</ToggleGroupItem>
                            {categories.map((category) => (
                                <ToggleGroupItem
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </CardContent>
                </Card>
            )}

            {articles.data.length === 0 ? (
                <Card>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <NewspaperIcon />
                                </EmptyMedia>
                                <EmptyTitle>Belum ada insight</EmptyTitle>
                                <EmptyDescription>
                                    Artikel baru akan segera hadir.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.data.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}

            {lastPage > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                        variant="secondary"
                        disabled={currentPage <= 1}
                        onClick={() => visit({ page: currentPage - 1 })}
                    >
                        <ChevronLeftIcon data-icon="inline-start" />
                        Sebelumnya
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Halaman {currentPage} dari {lastPage}
                    </span>
                    <Button
                        variant="secondary"
                        disabled={currentPage >= lastPage}
                        onClick={() => visit({ page: currentPage + 1 })}
                    >
                        Berikutnya
                        <ChevronRightIcon data-icon="inline-end" />
                    </Button>
                </div>
            )}
        </>
    );
}

InsightIndex.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Insight', href: index() },
    ],
    title: 'Insight',
    description:
        'Panduan praktis seputar strategi, teknologi, dan operasional untuk pemilik bisnis dan manajer.',
};
