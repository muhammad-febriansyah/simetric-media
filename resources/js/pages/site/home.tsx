import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    CheckCircle2Icon,
    HandshakeIcon,
    MessagesSquareIcon,
    RouteIcon,
} from 'lucide-react';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { ContentIcon } from '@/components/site/content-icon';
import { SectionHeading } from '@/components/site/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { howWeWork } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
import { show as showIndustry } from '@/routes/industries';
import { index as servicesIndex, show as showService } from '@/routes/services';
import type { CaseStudy, Industry, ProcessStep, Service } from '@/types';

type Props = {
    process: ProcessStep[];
    services: Service[];
    industries: Industry[];
    featuredCaseStudies: CaseStudy[];
};

const differentiators = [
    {
        icon: MessagesSquareIcon,
        title: 'Mulai dari masalah, bukan produk',
        description:
            'Kami tidak datang membawa katalog. Kami mendengarkan dan memetakan masalah bisnis Anda terlebih dahulu.',
    },
    {
        icon: RouteIcon,
        title: 'Proses jelas dari awal',
        description:
            'Setiap tahap punya hasil yang bisa Anda lihat: laporan assessment, roadmap, prototipe, sampai aplikasi live.',
    },
    {
        icon: HandshakeIcon,
        title: 'Didampingi sampai benar-benar jalan',
        description:
            'Kami ikut memastikan tim Anda memakai solusinya lewat training, pendampingan, dan support berkelanjutan.',
    },
];

export default function Home({
    process,
    services,
    industries,
    featuredCaseStudies,
}: Props) {
    return (
        <>
            <Head title="Konsultan Teknologi untuk Industri" />

            <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-2 lg:py-24">
                <div className="flex flex-col items-start gap-6">
                    <span className="text-sm font-semibold text-success">
                        #KonsultanTeknologi untuk Industri
                    </span>
                    <h1 className="text-4xl leading-tight font-bold md:text-5xl">
                        Dari masalah bisnis sampai solusi aplikasi yang
                        benar-benar berjalan.
                    </h1>
                    <p className="max-w-xl text-lg text-muted-foreground">
                        Kami bukan sekadar pembuat aplikasi. Kami konsultan yang
                        mendampingi perusahaan Anda dari konsultasi awal,
                        assessment, perancangan, pengembangan, sampai tim Anda
                        mahir memakainya.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button size="lg" asChild>
                            <Link href={consultationCreate()}>
                                Konsultasi Gratis
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="secondary" asChild>
                            <Link href={howWeWork()}>
                                <RouteIcon data-icon="inline-start" />
                                Lihat cara kami bekerja
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="gap-4 p-6 md:p-8">
                    <span className="text-sm font-semibold text-muted-foreground">
                        Perjalanan bersama kami
                    </span>
                    {process.slice(0, 4).map((step, position) => (
                        <div
                            key={step.title}
                            className="flex items-start gap-4 rounded-xl bg-muted p-4"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                {position + 1}
                            </span>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold">
                                    {step.title}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {step.deliverable}
                                </span>
                            </div>
                        </div>
                    ))}
                    <Link
                        href={howWeWork()}
                        className="flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                        +{process.length - 4} tahap berikutnya sampai solusi
                        berjalan
                        <ArrowRightIcon className="size-4" />
                    </Link>
                </Card>
            </section>

            <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 md:px-6">
                <SectionHeading
                    eyebrow="Kenapa konsultan?"
                    title="Banyak perusahaan teknologi menjual produk. Kami menyelesaikan masalah."
                    description="Klien industri butuh pendamping yang memahami bisnisnya, bukan hanya pembuat aplikasi."
                />
                <div className="grid gap-6 md:grid-cols-3">
                    {differentiators.map((item) => (
                        <Card key={item.title}>
                            <CardContent className="flex flex-col gap-4">
                                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                    <item.icon />
                                </span>
                                <h3 className="text-lg font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 md:px-6">
                <SectionHeading
                    eyebrow="Cara kami bekerja"
                    title={`${process.length} tahap, dari A sampai Z`}
                    description="Setiap tahap menghasilkan sesuatu yang bisa Anda lihat dan evaluasi."
                    action={
                        <Button variant="secondary" asChild>
                            <Link href={howWeWork()}>
                                Detail proses
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                    }
                />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {process.map((step, position) => (
                        <Card key={step.title}>
                            <CardContent className="flex flex-col gap-3">
                                <span className="text-3xl font-bold text-primary/25">
                                    {String(position + 1).padStart(2, '0')}
                                </span>
                                <h3 className="font-semibold">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {step.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {services.length > 0 && (
                <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 md:px-6">
                    <SectionHeading
                        eyebrow="Layanan"
                        title="Masalah yang sering kami bantu selesaikan"
                        action={
                            <Button variant="secondary" asChild>
                                <Link href={servicesIndex()}>
                                    Semua layanan
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Link>
                            </Button>
                        }
                    />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                href={showService(service.slug)}
                                className="group flex rounded-2xl"
                            >
                                <Card className="w-full transition-shadow group-hover:shadow-lg">
                                    <CardContent className="flex flex-col gap-4">
                                        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                            <ContentIcon
                                                iconName={service.icon}
                                            />
                                        </span>
                                        <Badge variant="secondary">
                                            {service.pillar.label}
                                        </Badge>
                                        <h3 className="text-lg font-semibold group-hover:text-primary">
                                            {service.headline ?? service.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {service.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {featuredCaseStudies.length > 0 && (
                <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 md:px-6">
                    <SectionHeading
                        eyebrow="Studi kasus"
                        title="Bukti dari perjalanan konsultasi nyata"
                        action={
                            <Button variant="secondary" asChild>
                                <Link href={caseStudiesIndex()}>
                                    Semua studi kasus
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Link>
                            </Button>
                        }
                    />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredCaseStudies.map((caseStudy) => (
                            <CaseStudyCard
                                key={caseStudy.id}
                                caseStudy={caseStudy}
                            />
                        ))}
                    </div>
                </section>
            )}

            {industries.length > 0 && (
                <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 md:px-6">
                    <SectionHeading
                        eyebrow="Industri"
                        title="Kami memahami tantangan di industri Anda"
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {industries.map((industry) => (
                            <Link
                                key={industry.id}
                                href={showIndustry(industry.slug)}
                                className="group flex items-center gap-4 rounded-2xl bg-card p-5 transition-shadow hover:shadow-lg"
                            >
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                    <ContentIcon iconName={industry.icon} />
                                </span>
                                <div className="flex flex-col">
                                    <span className="font-semibold group-hover:text-primary">
                                        {industry.name}
                                    </span>
                                    {industry.pain_points[0] && (
                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <CheckCircle2Icon className="size-3.5 text-success" />
                                            {industry.pain_points[0]}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
