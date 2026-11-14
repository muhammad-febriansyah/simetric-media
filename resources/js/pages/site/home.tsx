import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    CheckCircle2Icon,
    ClockIcon,
    HandshakeIcon,
    MessagesSquareIcon,
    PackageCheckIcon,
    QuoteIcon,
    RouteIcon,
} from 'lucide-react';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { ContentIcon } from '@/components/site/content-icon';
import { ProductCard } from '@/components/site/product-card';
import { SectionHeading } from '@/components/site/section-heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BlurFade } from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Safari } from '@/components/ui/safari';
import ShinyText from '@/components/ui/shiny-text';
import { Timeline } from '@/components/ui/timeline';
import { cn } from '@/lib/utils';
import { howWeWork } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
import { index as expertisesIndex } from '@/routes/expertises';
import { show as showIndustry } from '@/routes/industries';
import { index as productsIndex, show as showProduct } from '@/routes/products';
import type {
    CaseStudy,
    ClientLogo,
    Expertise,
    Industry,
    ProcessStep,
    Product,
    Testimonial,
} from '@/types';

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

const SECTION =
    'mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-14 md:px-6';

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('');
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
}: Props) {
    const heroProduct = products.find((product) => product.cover_image_url);
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
                <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 md:px-6 lg:grid-cols-2 lg:py-20">
                    <div className="flex flex-col items-start gap-6">
                        <BlurFade delay={0.05}>
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-1.5 text-sm font-semibold shadow-sm">
                                <span className="size-2 rounded-full bg-success" />
                                <ShinyText
                                    text="Konsultan teknologi A–Z untuk industri"
                                    color="#2547F9"
                                    shineColor="#9DB1FF"
                                    speed={3}
                                />
                            </span>
                        </BlurFade>
                        <BlurFade delay={0.15}>
                            <h1 className="text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-[3.4rem]">
                                Dari masalah bisnis sampai{' '}
                                <span className="text-primary">
                                    solusi aplikasi
                                </span>{' '}
                                yang benar-benar berjalan.
                            </h1>
                        </BlurFade>
                        <BlurFade delay={0.25}>
                            <p className="max-w-xl text-lg text-muted-foreground">
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
                        {heroProduct ? (
                            <Link
                                href={showProduct(heroProduct.slug)}
                                className="group relative block rounded-2xl"
                                aria-label={`Lihat produk ${heroProduct.name}`}
                            >
                                <Safari
                                    url={
                                        heroProduct.website_url
                                            ? new URL(heroProduct.website_url)
                                                  .hostname
                                            : heroProduct.slug
                                    }
                                    imageSrc={
                                        heroProduct.cover_image_url ?? undefined
                                    }
                                    className="drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-1"
                                />
                                <span className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 text-sm shadow-lg ring-1 ring-border">
                                    <PackageCheckIcon className="size-5 text-success" />
                                    <span className="flex flex-col">
                                        <span className="font-semibold">
                                            {heroProduct.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Dibangun & dijalankan tim kami
                                        </span>
                                    </span>
                                </span>
                            </Link>
                        ) : (
                            <Card className="gap-4 p-6 md:p-8">
                                {process.slice(0, 4).map((step, position) => (
                                    <div
                                        key={step.title}
                                        className="flex items-start gap-4 rounded-xl bg-muted p-4"
                                    >
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                            {position + 1}
                                        </span>
                                        <span className="font-semibold">
                                            {step.title}
                                        </span>
                                    </div>
                                ))}
                            </Card>
                        )}
                    </BlurFade>
                </div>
            </section>

            {/* Client & partner logos */}
            {clientLogos.length > 0 && (
                <section
                    aria-label="Klien dan mitra"
                    className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 md:px-6"
                >
                    <p className="text-center text-sm font-medium text-muted-foreground">
                        Dipercaya bisnis yang memakai layanan & produk kami
                    </p>
                    <div className="relative flex flex-col gap-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                        {logoRows.map((row, rowIndex) => (
                            <Marquee
                                key={rowIndex}
                                pauseOnHover
                                reverse={rowIndex % 2 === 1}
                                className="[--duration:45s] [--gap:1rem]"
                            >
                                {row.map((clientLogo) => (
                                    <div
                                        key={clientLogo.id}
                                        className="flex h-16 w-40 items-center justify-center rounded-xl bg-card px-4 ring-1 ring-border"
                                    >
                                        <img
                                            src={clientLogo.logo_url}
                                            alt={clientLogo.name}
                                            title={clientLogo.name}
                                            loading="lazy"
                                            className="max-h-10 w-full object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                                        />
                                    </div>
                                ))}
                            </Marquee>
                        ))}
                    </div>
                </section>
            )}

            {/* Numbers */}
            {statItems.length > 0 && (
                <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
                    {statItems.map((item, index) => (
                        <BlurFade key={item.label} delay={0.05 * index} inView>
                            <Card className="h-full">
                                <CardContent className="flex flex-col gap-1">
                                    <span className="text-4xl font-bold text-primary">
                                        <NumberTicker value={item.value} />+
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {item.label}
                                    </span>
                                </CardContent>
                            </Card>
                        </BlurFade>
                    ))}
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
                        <BlurFade key={item.title} delay={0.08 * index} inView>
                            <Card className="h-full">
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
                        </BlurFade>
                    ))}
                </div>
            </section>

            {/* Expertise bento */}
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
                    <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
                        {expertises.map((expertise, index) => (
                            <BlurFade
                                key={expertise.id}
                                delay={0.06 * index}
                                inView
                                className={cn(
                                    index % 4 === 0 || index % 4 === 3
                                        ? 'md:col-span-2'
                                        : 'md:col-span-1',
                                )}
                            >
                                <Link
                                    href={`${expertisesIndex.url()}#${expertise.slug}`}
                                    className="group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-card p-6 transition-shadow hover:shadow-lg"
                                >
                                    <DotPattern className="[mask-image:radial-gradient(circle_at_top_right,white,transparent_60%)] text-primary/10" />
                                    <div className="relative flex flex-col gap-3">
                                        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                            <ContentIcon
                                                iconName={expertise.icon}
                                            />
                                        </span>
                                        <h3 className="text-xl font-semibold group-hover:text-primary">
                                            {expertise.name}
                                        </h3>
                                        {expertise.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {expertise.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="relative flex flex-wrap items-center gap-2">
                                        {(expertise.services ?? [])
                                            .slice(0, 3)
                                            .map((service) => (
                                                <Badge
                                                    key={service.id}
                                                    variant="secondary"
                                                >
                                                    {service.name}
                                                </Badge>
                                            ))}
                                        <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-primary">
                                            {expertise.services_count} layanan
                                            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            </BlurFade>
                        ))}
                    </div>
                </section>
            )}

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
                        eyebrow="Produk kami"
                        title="Kami juga membangun dan menjalankan produk sendiri"
                        description="Pengalaman mengelola platform kami sendiri, dari ide sampai dipakai banyak pengguna, kami bawa ke setiap proyek klien."
                        action={
                            <Button variant="secondary" asChild>
                                <Link href={productsIndex()}>
                                    Semua produk
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
                                className="relative flex overflow-hidden rounded-2xl"
                            >
                                <ProductCard product={product} />
                                {index === 0 && (
                                    <BorderBeam
                                        size={120}
                                        duration={8}
                                        colorFrom="#2547F9"
                                        colorTo="#47BB8E"
                                        className="rounded-2xl"
                                    />
                                )}
                            </BlurFade>
                        ))}
                    </div>
                </section>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
                <section className="flex w-full flex-col gap-10 py-14">
                    <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                        <SectionHeading
                            eyebrow="Testimoni"
                            title="Kata mereka yang sudah bekerja bersama kami"
                        />
                    </div>
                    <div className="relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                        <Marquee
                            pauseOnHover
                            className="[--duration:70s] [--gap:1.25rem]"
                        >
                            {testimonials.map((testimonial) => (
                                <figure
                                    key={testimonial.id}
                                    className="flex w-80 flex-col gap-4 rounded-2xl bg-card p-6 md:w-96"
                                >
                                    <QuoteIcon className="size-6 text-primary/40" />
                                    <blockquote className="flex-1 text-sm leading-relaxed">
                                        {testimonial.quote}
                                    </blockquote>
                                    <figcaption className="flex items-center gap-3">
                                        <Avatar className="size-10">
                                            {testimonial.photo_url && (
                                                <AvatarImage
                                                    src={testimonial.photo_url}
                                                    alt={
                                                        testimonial.author_name
                                                    }
                                                />
                                            )}
                                            <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                                                {initials(
                                                    testimonial.author_name,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="flex flex-col">
                                            <span className="text-sm font-semibold">
                                                {testimonial.author_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {[
                                                    testimonial.author_position,
                                                    testimonial.company,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </span>
                                        </span>
                                    </figcaption>
                                </figure>
                            ))}
                        </Marquee>
                    </div>
                </section>
            )}

            {/* Industries */}
            {industries.length > 0 && (
                <section className={SECTION}>
                    <SectionHeading
                        eyebrow="Industri"
                        title="Kami memahami tantangan di industri Anda"
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {industries.map((industry, index) => (
                            <BlurFade
                                key={industry.id}
                                delay={0.03 * (index % 6)}
                                inView
                            >
                                <Link
                                    href={showIndustry(industry.slug)}
                                    className="group flex h-full items-center gap-4 rounded-2xl bg-card p-5 transition-shadow hover:shadow-lg"
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
                                                <CheckCircle2Icon className="size-3.5 shrink-0 text-success" />
                                                {industry.pain_points[0]}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </BlurFade>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
