import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    CheckCircle2Icon,
    ClockIcon,
    HandshakeIcon,
    MessagesSquareIcon,
    PackageCheckIcon,
    RouteIcon,
} from 'lucide-react';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { ContentIcon } from '@/components/site/content-icon';
import { FaqList } from '@/components/site/faq-list';
import { HeroServiceLines } from '@/components/site/hero-service-lines';
import { IntegrationDiagram } from '@/components/site/integration-diagram';
import { ProductCard } from '@/components/site/product-card';
import { SectionHeading } from '@/components/site/section-heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BlurFade } from '@/components/ui/blur-fade';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Timeline } from '@/components/ui/timeline';
import { cn } from '@/lib/utils';
import { howWeWork } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
import { index as expertisesIndex } from '@/routes/expertises';
import { show as showIndustry } from '@/routes/industries';
import { index as productsIndex } from '@/routes/products';
import type {
    CaseStudy,
    ClientLogo,
    Expertise,
    Faq,
    Industry,
    ProcessStep,
    Product,
    Testimonial,
} from '@/types';
import type { HoverEffectItem } from '@/components/ui/card-hover-effect';

type Stats = {
    caseStudies: number;
    products: number;
    industries: number;
    clients: number;
};

type Props = {
    process: ProcessStep[];
    stats: Stats;
    expertises: Expertise[];
    industries: Industry[];
    featuredCaseStudies: CaseStudy[];
    products: Product[];
    clientLogos: ClientLogo[];
    testimonials: Testimonial[];
    faqs: Faq[];
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

const integrationPoints = [
    'Tanpa harus mengganti sistem yang sudah dipakai',
    'Data dimasukkan sekali, dipakai di semua bagian',
    'Laporan manajemen terbarui otomatis',
];

/** Main service lines highlighted on the right side of the hero. */
const heroServiceLines = [
    'Web Application Development',
    'Mobile Application Development',
    'AI Automation Solutions',
];

const SECTION =
    'mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-14 md:px-6';

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('');
}

function ReviewCard({
    testimonial,
    className = 'w-72 md:w-80',
}: {
    testimonial: Testimonial;
    className?: string;
}) {
    return (
        <figure
            className={cn(
                'flex flex-col gap-3 rounded-2xl bg-card p-5 text-foreground',
                className,
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar className="size-9">
                    {testimonial.photo_url && (
                        <AvatarImage
                            src={testimonial.photo_url}
                            alt={testimonial.author_name}
                        />
                    )}
                    <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                        {initials(testimonial.author_name)}
                    </AvatarFallback>
                </Avatar>
                <figcaption className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold">
                        {testimonial.author_name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                        {[testimonial.author_position, testimonial.company]
                            .filter(Boolean)
                            .join(', ')}
                    </span>
                </figcaption>
            </div>
            <blockquote className="line-clamp-4 text-sm leading-relaxed text-foreground/90">
                {testimonial.quote}
            </blockquote>
        </figure>
    );
}

export default function Home({
    process,
    stats,
    expertises,
    industries,
    featuredCaseStudies,
    products,
    clientLogos,
    testimonials,
    faqs,
}: Props) {
    const [firstTestimonialRow, secondTestimonialRow] = [
        testimonials.slice(0, Math.ceil(testimonials.length / 2)),
        testimonials.slice(Math.ceil(testimonials.length / 2)),
    ];
    const industryItems: HoverEffectItem[] = industries.map((industry) => ({
        key: industry.id,
        href: showIndustry(industry.slug),
        content: (
            <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <ContentIcon iconName={industry.icon} />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-semibold group-hover:text-primary">
                        {industry.name}
                    </span>
                    {industry.pain_points[0] && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CheckCircle2Icon className="size-3.5 shrink-0 text-success" />
                            {industry.pain_points[0]}
                        </span>
                    )}
                </div>
            </div>
        ),
    }));
    const statItems = [
        { label: 'Studi kasus terdokumentasi', value: stats.caseStudies },
        { label: 'Produk digital milik kami', value: stats.products },
        { label: 'Industri yang kami pahami', value: stats.industries },
        { label: 'Klien & mitra', value: stats.clients },
    ].filter((item) => item.value > 0);
    const logoRows =
        clientLogos.length > 10
            ? [
                  clientLogos.slice(0, Math.ceil(clientLogos.length / 2)),
                  clientLogos.slice(Math.ceil(clientLogos.length / 2)),
              ]
            : [clientLogos];

    return (
        <>
            <Head title="Konsultan Teknologi untuk Industri" />

            {/* Hero */}
            <section className="relative isolate overflow-hidden">
                <DotPattern className="-z-10 [mask-image:radial-gradient(ellipse_at_top,white_20%,transparent_70%)]" />
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:py-24">
                    <div className="flex flex-col items-start gap-6">
                        <BlurFade delay={0.05}>
                            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold text-primary md:text-base">
                                <span className="size-2 shrink-0 rounded-full bg-success" />
                                Across-industrial digital consultant
                            </span>
                        </BlurFade>
                        <BlurFade delay={0.15}>
                            <h1 className="text-4xl leading-[1.15] font-bold tracking-tight md:text-5xl xl:text-[3.5rem]">
                                Dari masalah bisnis sampai{' '}
                                <span className="text-primary">
                                    solusi aplikasi
                                </span>{' '}
                                yang{' '}
                                <span className="whitespace-nowrap">
                                    benar-benar
                                </span>{' '}
                                berjalan.
                            </h1>
                        </BlurFade>
                        <BlurFade delay={0.25}>
                            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
                                Kami bukan sekadar pembuat aplikasi. Kami
                                mendampingi perusahaan Anda dari konsultasi
                                awal, assessment, perancangan, pengembangan,
                                sampai tim Anda mahir memakainya.
                            </p>
                        </BlurFade>
                        <BlurFade delay={0.35}>
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
                        </BlurFade>
                    </div>

                    <BlurFade delay={0.3} direction="left">
                        <HeroServiceLines items={heroServiceLines} />
                    </BlurFade>
                </div>
            </section>

            {/* Client & partner logos (Magic UI Marquee) */}
            {clientLogos.length > 0 && (
                <section
                    aria-label="Klien dan mitra"
                    className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-12 md:px-6"
                >
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                            Klien & mitra
                        </span>
                        <h2 className="max-w-xl text-xl leading-snug font-bold text-balance md:text-2xl">
                            Dipercaya bisnis yang memakai layanan dan produk
                            kami
                        </h2>
                    </div>
                    <div className="relative flex w-full flex-col gap-3 overflow-hidden">
                        {logoRows.map((row, rowIndex) => (
                            <Marquee
                                key={rowIndex}
                                pauseOnHover
                                reverse={rowIndex % 2 === 1}
                                className="[--duration:50s] [--gap:1rem]"
                            >
                                {row.map((clientLogo) => (
                                    <div
                                        key={clientLogo.id}
                                        className="site-card flex h-16 w-40 items-center justify-center px-5"
                                    >
                                        <img
                                            src={clientLogo.logo_url}
                                            alt={clientLogo.name}
                                            title={clientLogo.name}
                                            loading="lazy"
                                            className="max-h-9 w-full object-contain"
                                        />
                                    </div>
                                ))}
                            </Marquee>
                        ))}
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background" />
                    </div>
                </section>
            )}

            {/* Numbers (Magic UI Number Ticker) */}
            {statItems.length > 0 && (
                <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <dl className="grid grid-cols-2 gap-y-8 border-y py-10 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none">
                        {statItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex flex-col-reverse gap-1 px-4 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
                            >
                                <dt className="text-sm text-muted-foreground">
                                    {item.label}
                                </dt>
                                <dd className="text-4xl font-semibold tracking-tighter md:text-5xl">
                                    <NumberTicker value={item.value} />
                                    <span className="text-primary">+</span>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            {/* Why a consultant */}
            <section className={SECTION}>
                <SectionHeading
                    eyebrow="Kenapa konsultan?"
                    title="Banyak perusahaan teknologi menjual produk. Kami menyelesaikan masalah."
                    description="Klien industri butuh pendamping yang memahami bisnisnya, bukan hanya pembuat aplikasi."
                />
                <div className="grid gap-6 md:grid-cols-3">
                    {differentiators.map((item, index) => (
                        <BlurFade
                            key={item.title}
                            delay={0.08 * index}
                            inView
                            className="flex"
                        >
                            <div className="site-card flex w-full flex-col gap-4 p-6">
                                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                    <item.icon />
                                </span>
                                <h3 className="text-lg font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </BlurFade>
                    ))}
                </div>
            </section>

            {/* Expertise (Magic UI Bento Grid) */}
            {expertises.length > 0 && (
                <section className={SECTION}>
                    <SectionHeading
                        eyebrow="Keahlian"
                        title="Satu tim untuk strategi, desain, pengembangan, dan pendampingan"
                        action={
                            <Button variant="secondary" asChild>
                                <Link href={expertisesIndex()}>
                                    Semua keahlian
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Link>
                            </Button>
                        }
                    />
                    <BentoGrid>
                        {expertises.map((expertise, index) => (
                            <BentoCard
                                key={expertise.id}
                                name={expertise.name}
                                description={expertise.description}
                                icon={<ContentIcon iconName={expertise.icon} />}
                                href={`${expertisesIndex.url()}#${expertise.slug}`}
                                cta={`Lihat ${expertise.services_count ?? 0} layanan`}
                                className={
                                    index % 4 === 0 || index % 4 === 3
                                        ? 'lg:col-span-2'
                                        : 'lg:col-span-1'
                                }
                                background={
                                    <div className="flex flex-wrap content-start gap-2 [mask-image:linear-gradient(to_bottom,black_30%,transparent_75%)] p-6">
                                        {(expertise.services ?? []).map(
                                            (service) => (
                                                <Badge
                                                    key={service.id}
                                                    variant="secondary"
                                                >
                                                    {service.name}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                }
                            />
                        ))}
                    </BentoGrid>
                </section>
            )}

            {/* System integration (Magic UI Animated Beam) */}
            <section className={SECTION}>
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <SectionHeading
                            eyebrow="Integrasi sistem"
                            title="Data yang tersebar, kami satukan dalam satu alur"
                            description="Banyak perusahaan sudah memakai spreadsheet, WhatsApp, dan software akuntansi. Kami tidak selalu menggantinya. Kami menghubungkannya supaya laporan berjalan otomatis."
                        />
                        <ul className="flex flex-col gap-3">
                            {integrationPoints.map((point) => (
                                <li
                                    key={point}
                                    className="flex items-start gap-3 text-sm"
                                >
                                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                        <Button variant="secondary" asChild className="w-fit">
                            <Link href={consultationCreate()}>
                                <MessagesSquareIcon data-icon="inline-start" />
                                Diskusikan sistem Anda
                            </Link>
                        </Button>
                    </div>
                    <IntegrationDiagram />
                </div>
            </section>

            {/* Process timeline */}
            <section className={SECTION}>
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
                <Timeline
                    data={process.map((step, position) => ({
                        eyebrow: `Tahap ${String(position + 1).padStart(2, '0')}`,
                        title: step.title,
                        content: (
                            <Card>
                                <CardContent className="flex flex-col gap-4">
                                    <p className="text-muted-foreground">
                                        {step.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="h-auto text-left whitespace-normal"
                                        >
                                            <PackageCheckIcon />
                                            {step.deliverable}
                                        </Badge>
                                        <Badge variant="outline">
                                            <ClockIcon />
                                            {step.duration}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ),
                    }))}
                />
            </section>

            {/* Case studies */}
            {featuredCaseStudies.length > 0 && (
                <section className={SECTION}>
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
                        {featuredCaseStudies.map((caseStudy, index) => (
                            <BlurFade
                                key={caseStudy.id}
                                delay={0.08 * index}
                                inView
                                className="flex"
                            >
                                <CaseStudyCard caseStudy={caseStudy} />
                            </BlurFade>
                        ))}
                    </div>
                </section>
            )}

            {/* Products */}
            {products.length > 0 && (
                <section className={SECTION}>
                    <SectionHeading
                        eyebrow="Portfolio"
                        title="Kami juga membangun dan menjalankan produk sendiri"
                        description="Pengalaman mengelola platform kami sendiri, dari ide sampai dipakai banyak pengguna, kami bawa ke setiap proyek klien."
                        action={
                            <Button variant="secondary" asChild>
                                <Link href={productsIndex()}>
                                    Semua portfolio
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Link>
                            </Button>
                        }
                    />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product, index) => (
                            <BlurFade
                                key={product.id}
                                delay={0.08 * index}
                                inView
                                className="flex"
                            >
                                <ProductCard product={product} />
                            </BlurFade>
                        ))}
                    </div>
                </section>
            )}

            {/* Testimonials on a navy band (Magic UI Marquee) */}
            {testimonials.length > 0 && (
                <section className="bg-navy text-navy-foreground">
                    <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1fr_1.2fr]">
                        <div className="flex flex-col items-start gap-6">
                            <SectionHeading
                                onDark
                                eyebrow="Testimoni"
                                title="Kata mereka yang sudah bekerja bersama kami"
                                description="Cerita langsung dari klien dan pengguna produk yang kami bangun dan jalankan."
                            />
                            <Button size="lg" asChild>
                                <Link href={consultationCreate()}>
                                    <MessagesSquareIcon data-icon="inline-start" />
                                    Mulai konsultasi
                                </Link>
                            </Button>
                        </div>

                        <div className="relative hidden h-[34rem] grid-cols-2 gap-4 overflow-hidden lg:grid">
                            {[firstTestimonialRow, secondTestimonialRow].map(
                                (column, columnIndex) => (
                                    <Marquee
                                        key={columnIndex}
                                        vertical
                                        pauseOnHover
                                        reverse={columnIndex === 1}
                                        className="h-full [--duration:40s]"
                                    >
                                        {column.map((testimonial) => (
                                            <ReviewCard
                                                key={testimonial.id}
                                                testimonial={testimonial}
                                                className="w-full"
                                            />
                                        ))}
                                    </Marquee>
                                ),
                            )}
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-navy" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-navy" />
                        </div>

                        <div className="relative -mx-4 overflow-hidden md:-mx-6 lg:hidden">
                            <Marquee pauseOnHover className="[--duration:45s]">
                                {testimonials.map((testimonial) => (
                                    <ReviewCard
                                        key={testimonial.id}
                                        testimonial={testimonial}
                                    />
                                ))}
                            </Marquee>
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-navy" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-navy" />
                        </div>
                    </div>
                </section>
            )}

            {/* Industries (Aceternity Card Hover Effect) */}
            {industries.length > 0 && (
                <section className={SECTION}>
                    <SectionHeading
                        eyebrow="Industri"
                        title="Kami memahami tantangan di industri Anda"
                    />
                    <HoverEffect items={industryItems} className="-m-2" />
                </section>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
                <section className={SECTION}>
                    <SectionHeading
                        align="center"
                        eyebrow="Tanya jawab"
                        title="Pertanyaan yang sering diajukan"
                    />
                    <FaqList faqs={faqs} />
                </section>
            )}
        </>
    );
}
