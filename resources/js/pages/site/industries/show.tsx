import { Head, Link } from '@inertiajs/react';
import { AlertCircleIcon, ArrowRightIcon } from 'lucide-react';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { ContentIcon } from '@/components/site/content-icon';
import { PageHeader } from '@/components/page-header';
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
import { index, show } from '@/routes/industries';
import type { CaseStudy, Industry } from '@/types';

type Props = {
    industry: Industry;
    caseStudies: CaseStudy[];
};

export default function IndustryShow({ industry, caseStudies }: Props) {
    const pageHeader = {
        breadcrumbs: [
            { title: 'Beranda', href: home() },
            { title: 'Industri', href: index() },
            { title: industry.name, href: show(industry.slug) },
        ],
        title: `Solusi untuk ${industry.name}`,
        description: industry.summary ?? undefined,
    };

    return (
        <>
            <Head title={industry.name} />

            <PageHeader {...pageHeader} />

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Masalah yang sering kami temui</CardTitle>
                        <CardDescription>
                            Apakah salah satunya terjadi di perusahaan Anda?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {industry.pain_points.map((painPoint) => (
                            <div
                                key={painPoint}
                                className="flex items-start gap-3 rounded-xl bg-muted p-4"
                            >
                                <AlertCircleIcon className="mt-0.5 size-5 shrink-0 text-primary" />
                                <span className="text-sm font-medium">
                                    {painPoint}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col gap-4">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                            <ContentIcon iconName={industry.icon} />
                        </span>
                        <h2 className="text-lg font-semibold">
                            Mulai dari konsultasi
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Ceritakan kondisi perusahaan Anda. Kami bantu
                            petakan prioritas masalah dan solusi yang paling
                            masuk akal.
                        </p>
                        <Button asChild>
                            <Link href={consultationCreate()}>
                                Konsultasi Gratis
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {caseStudies.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Studi kasus {industry.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {caseStudies.map((caseStudy) => (
                            <CaseStudyCard
                                key={caseStudy.id}
                                caseStudy={caseStudy}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}
        </>
    );
}

IndustryShow.layout = {
    inner: true,
};
