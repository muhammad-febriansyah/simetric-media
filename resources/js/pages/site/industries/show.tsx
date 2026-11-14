import { Head } from '@inertiajs/react';
import { AlertCircleIcon } from 'lucide-react';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { ConsultActions } from '@/components/site/consult-actions';
import { DetailSection } from '@/components/site/detail-section';
import { FaqList } from '@/components/site/faq-list';
import { SitePageHeader } from '@/components/site/site-page-header';
import { home } from '@/routes';
import { index, show } from '@/routes/industries';
import type { CaseStudy, Faq, Industry } from '@/types';

type Props = {
    industry: Industry;
    caseStudies: CaseStudy[];
    faqs: Faq[];
};

export default function IndustryShow({ industry, caseStudies, faqs }: Props) {
    return (
        <>
            <Head title={industry.name} />

            <SitePageHeader
                breadcrumbs={[
                    { title: 'Beranda', href: home() },
                    { title: 'Industri', href: index() },
                    { title: industry.name, href: show(industry.slug) },
                ]}
                eyebrow={`Industri ${industry.name}`}
                title={`Solusi untuk ${industry.name}`}
                description={industry.summary ?? undefined}
            >
                <ConsultActions
                    message={`Halo, saya dari industri ${industry.name} dan ingin konsultasi.`}
                />
            </SitePageHeader>

            {industry.pain_points.length > 0 && (
                <DetailSection
                    eyebrow="Tantangan umum"
                    title="Masalah yang sering kami temui"
                    description="Apakah salah satunya terjadi di perusahaan Anda?"
                >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {industry.pain_points.map((painPoint) => (
                            <div
                                key={painPoint}
                                className="site-card flex items-start gap-4 p-5"
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                    <AlertCircleIcon className="size-5" />
                                </span>
                                <span className="pt-2 text-sm font-semibold">
                                    {painPoint}
                                </span>
                            </div>
                        ))}
                    </div>
                </DetailSection>
            )}

            {caseStudies.length > 0 && (
                <DetailSection
                    eyebrow="Studi kasus"
                    title={`Studi kasus ${industry.name}`}
                >
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {caseStudies.map((caseStudy) => (
                            <CaseStudyCard
                                key={caseStudy.id}
                                caseStudy={caseStudy}
                            />
                        ))}
                    </div>
                </DetailSection>
            )}

            {faqs.length > 0 && (
                <DetailSection
                    eyebrow="Tanya jawab"
                    title={`Pertanyaan seputar ${industry.name}`}
                >
                    <FaqList faqs={faqs} />
                </DetailSection>
            )}
        </>
    );
}

IndustryShow.layout = {
    inner: true,
};
