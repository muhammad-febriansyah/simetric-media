import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, CheckCircle2Icon } from 'lucide-react';
import { ContentIcon } from '@/components/site/content-icon';
import { SiteEmpty } from '@/components/site/site-empty';
import { home } from '@/routes';
import { index, show } from '@/routes/industries';
import type { Industry } from '@/types';

export default function IndustryIndex({
    industries,
}: {
    industries: Industry[];
}) {
    return (
        <>
            <Head title="Industri" />

            {industries.length === 0 ? (
                <SiteEmpty
                    title="Belum ada data industri"
                    description="Hubungi kami untuk mendiskusikan kebutuhan industri Anda."
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {industries.map((industry) => (
                        <Link
                            key={industry.id}
                            href={show(industry.slug)}
                            className="group flex rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            <div className="site-card site-card-interactive flex w-full flex-col gap-5 p-6">
                                <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground [&_svg]:size-6">
                                    <ContentIcon iconName={industry.icon} />
                                </span>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-xl font-bold group-hover:text-primary">
                                        {industry.name}
                                    </h2>
                                    {industry.summary && (
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {industry.summary}
                                        </p>
                                    )}
                                </div>
                                {industry.pain_points.length > 0 && (
                                    <div className="flex flex-col gap-2 border-t border-dashed pt-4">
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            Masalah yang sering kami temui
                                        </span>
                                        <ul className="flex flex-col gap-2">
                                            {industry.pain_points
                                                .slice(0, 3)
                                                .map((painPoint) => (
                                                    <li
                                                        key={painPoint}
                                                        className="flex items-start gap-2 text-sm"
                                                    >
                                                        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                                                        {painPoint}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                                <span className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
                                    Lihat solusi
                                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}

IndustryIndex.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Industri', href: index() },
    ],
    eyebrow: 'Industri',
    title: 'Industri yang Kami Layani',
    description:
        'Setiap industri punya tantangan berbeda. Kami mulai dengan memahami cara kerja bisnis Anda.',
};
