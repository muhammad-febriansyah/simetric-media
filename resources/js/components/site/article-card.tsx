import { Link } from '@inertiajs/react';
import { ArrowRightIcon, NewspaperIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { show } from '@/routes/insights';
import type { Article } from '@/types';

/**
 * Insight card in the BuildWithAngga course-card style.
 */
export function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            href={show(article.slug)}
            className="group flex w-full rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <div className="site-card site-card-interactive flex w-full flex-col gap-6 p-6 md:p-7.5">
                {article.cover_image_url ? (
                    <img
                        src={article.cover_image_url}
                        alt={article.title}
                        loading="lazy"
                        className="aspect-video w-full rounded-2xl object-cover"
                    />
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                        <NewspaperIcon className="size-12" />
                    </div>
                )}
                <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {article.category && (
                            <Badge variant="secondary">
                                {article.category}
                            </Badge>
                        )}
                        {article.published_at_label && (
                            <span>{article.published_at_label}</span>
                        )}
                    </div>
                    <h3 className="line-clamp-2 text-xl leading-[1.5] font-bold">
                        {article.title}
                    </h3>
                    {article.excerpt && (
                        <p className="line-clamp-2 font-light text-muted-foreground">
                            {article.excerpt}
                        </p>
                    )}
                </div>
                <span className="flex items-center gap-1.5 font-semibold text-primary">
                    Baca insight
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
        </Link>
    );
}
