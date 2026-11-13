import { Link } from '@inertiajs/react';
import { ArrowRightIcon, NewspaperIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { show } from '@/routes/insights';
import type { Article } from '@/types';

export function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            href={show(article.slug)}
            className="group flex rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <Card className="w-full gap-0 overflow-hidden py-0 transition-shadow group-hover:shadow-lg">
                {article.cover_image_url ? (
                    <img
                        src={article.cover_image_url}
                        alt={article.title}
                        loading="lazy"
                        className="aspect-video w-full object-cover"
                    />
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-accent text-accent-foreground">
                        <NewspaperIcon className="size-10" />
                    </div>
                )}
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {article.category && (
                            <Badge variant="secondary">
                                {article.category}
                            </Badge>
                        )}
                        {article.published_at_label && (
                            <span>{article.published_at_label}</span>
                        )}
                    </div>
                    <h3 className="line-clamp-2 leading-snug font-semibold group-hover:text-primary">
                        {article.title}
                    </h3>
                    {article.excerpt && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {article.excerpt}
                        </p>
                    )}
                    <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-primary">
                        Baca insight
                        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                </CardContent>
            </Card>
        </Link>
    );
}
