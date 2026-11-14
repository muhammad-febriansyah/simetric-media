import { Link } from '@inertiajs/react';
import { ArrowRightIcon, FolderKanbanIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { show } from '@/routes/case-studies';
import type { CaseStudy } from '@/types';

/**
 * Case study card in the BuildWithAngga course-card style: inset rounded
 * cover, bold 20px title, and the headline result in the footer.
 */
export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
    const highlight = caseStudy.results[0];

    return (
        <Link
            href={show(caseStudy.slug)}
            className="group flex w-full rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <div className="site-card site-card-interactive flex w-full flex-col gap-6 p-6 md:p-7.5">
                {caseStudy.cover_image_url ? (
                    <img
                        src={caseStudy.cover_image_url}
                        alt={caseStudy.title}
                        loading="lazy"
                        className="aspect-video w-full rounded-2xl object-cover"
                    />
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                        <FolderKanbanIcon className="size-12" />
                    </div>
                )}
                <div className="flex flex-1 flex-col gap-3">
                    {caseStudy.industry && (
                        <Badge variant="secondary" className="w-fit">
                            {caseStudy.industry.name}
                        </Badge>
                    )}
                    <h3 className="text-xl leading-[1.5] font-bold">
                        {caseStudy.title}
                    </h3>
                    {caseStudy.excerpt && (
                        <p className="line-clamp-2 font-light text-muted-foreground">
                            {caseStudy.excerpt}
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-between gap-4">
                    {highlight ? (
                        <span className="text-sm">
                            <span className="font-bold text-primary">
                                {highlight.value}
                            </span>{' '}
                            <span className="text-muted-foreground">
                                {highlight.label.toLowerCase()}
                            </span>
                        </span>
                    ) : (
                        <span />
                    )}
                    <ArrowRightIcon className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
