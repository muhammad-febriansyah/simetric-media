import { Link } from '@inertiajs/react';
import { ArrowRightIcon, FolderKanbanIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { show } from '@/routes/case-studies';
import type { CaseStudy } from '@/types';

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
    const highlight = caseStudy.results[0];

    return (
        <Link
            href={show(caseStudy.slug)}
            className="group flex rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <Card className="w-full gap-0 overflow-hidden py-0 transition-shadow group-hover:shadow-lg">
                {caseStudy.cover_image_url ? (
                    <img
                        src={caseStudy.cover_image_url}
                        alt={caseStudy.title}
                        className="aspect-video w-full object-cover"
                    />
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-accent text-accent-foreground">
                        <FolderKanbanIcon className="size-10" />
                    </div>
                )}
                <CardContent className="flex flex-1 flex-col gap-3 p-6">
                    {caseStudy.industry && (
                        <Badge variant="secondary">
                            {caseStudy.industry.name}
                        </Badge>
                    )}
                    <h3 className="text-lg leading-snug font-semibold group-hover:text-primary">
                        {caseStudy.title}
                    </h3>
                    {caseStudy.excerpt && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {caseStudy.excerpt}
                        </p>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                        {highlight ? (
                            <span className="text-sm">
                                <span className="font-semibold text-primary">
                                    {highlight.value}
                                </span>{' '}
                                <span className="text-muted-foreground">
                                    {highlight.label.toLowerCase()}
                                </span>
                            </span>
                        ) : (
                            <span />
                        )}
                        <ArrowRightIcon className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
