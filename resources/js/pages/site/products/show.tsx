import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    CheckCircle2Icon,
    ExternalLinkIcon,
    QuoteIcon,
} from 'lucide-react';
import { SitePageHeader } from '@/components/site/site-page-header';
import { RichText } from '@/components/rich-text';
import { DetailSection } from '@/components/site/detail-section';
import { ProductCard, ProductLogo } from '@/components/site/product-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { create as consultationCreate } from '@/routes/consultation';
import { index, show } from '@/routes/products';
import type { ClientLogo, Product, Testimonial } from '@/types';

type Props = {
    product: Product;
    clientLogos: ClientLogo[];
    testimonials: Testimonial[];
    otherProducts: Product[];
};

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('');
}

export default function ProductShow({
    product,
    clientLogos,
    testimonials,
    otherProducts,
}: Props) {
    const pageHeader = {
        breadcrumbs: [
            { title: 'Beranda', href: home() },
            { title: 'Produk', href: index() },
            { title: product.name, href: show(product.slug) },
        ],
        title: product.name,
        description: product.tagline ?? product.category ?? 'Produk kami',
    };

    return (
        <>
            <Head title={product.meta_title ?? product.name}>
                {product.meta_description && (
                    <meta
                        name="description"
                        content={product.meta_description}
                    />
                )}
            </Head>

            <SitePageHeader
                {...pageHeader}
                eyebrow={product.category ?? 'Produk kami'}
            >
                <div className="flex flex-wrap gap-3">
                    {product.website_url && (
                        <Button size="lg" asChild>
                            <a
                                href={product.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLinkIcon data-icon="inline-start" />
                                Kunjungi {product.name}
                            </a>
                        </Button>
                    )}
                    <Button size="lg" variant="secondary" asChild>
                        <Link href={consultationCreate()}>
                            Bangun produk serupa
                            <ArrowRightIcon data-icon="inline-end" />
                        </Link>
                    </Button>
                </div>
            </SitePageHeader>

            <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="flex flex-col gap-6">
                    {product.cover_image_url && (
                        <div className="site-card overflow-hidden">
                            <img
                                src={product.cover_image_url}
                                alt={product.name}
                                className="aspect-video w-full object-cover object-top"
                            />
                        </div>
                    )}
                    <article className="site-card flex flex-col gap-5 p-6 md:p-8">
                        <div className="flex items-center gap-4">
                            <ProductLogo
                                product={product}
                                className="size-14"
                            />
                            <div className="flex flex-col gap-1.5">
                                <h2 className="text-xl font-bold">
                                    Tentang {product.name}
                                </h2>
                                {product.category && (
                                    <Badge
                                        variant="secondary"
                                        className="w-fit"
                                    >
                                        {product.category}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {product.summary && (
                            <p className="border-l-4 border-primary pl-4 text-lg leading-relaxed font-semibold">
                                {product.summary}
                            </p>
                        )}
                        {product.body && (
                            <RichText
                                html={product.body}
                                className="text-muted-foreground"
                            />
                        )}
                    </article>
                </div>

                <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
                    {product.highlights.length > 0 && (
                        <dl className="grid grid-cols-2 gap-4">
                            {product.highlights.map((highlight) => (
                                <div
                                    key={highlight.label}
                                    className="site-card flex flex-col-reverse gap-1 p-5"
                                >
                                    <dt className="text-xs text-muted-foreground">
                                        {highlight.label}
                                    </dt>
                                    <dd className="text-2xl font-bold text-primary">
                                        {highlight.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    {product.features.length > 0 && (
                        <div className="site-card flex flex-col gap-5 p-6">
                            <h2 className="text-lg font-bold">Fitur utama</h2>
                            <ul className="flex flex-col gap-4">
                                {product.features.map((feature) => (
                                    <li
                                        key={feature.title}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-success" />
                                        <span className="flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold">
                                                {feature.title}
                                            </span>
                                            {feature.description && (
                                                <span className="text-sm text-muted-foreground">
                                                    {feature.description}
                                                </span>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </aside>
            </div>

            {clientLogos.length > 0 && (
                <DetailSection
                    eyebrow="Klien & mitra"
                    title={`Dipakai dan didukung bisnis yang bekerja sama dengan ${product.name}`}
                >
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {clientLogos.map((clientLogo) => (
                            <div
                                key={clientLogo.id}
                                className="site-card flex flex-col items-center gap-3 p-5 text-center"
                            >
                                <img
                                    src={clientLogo.logo_url}
                                    alt={`Logo ${clientLogo.name}`}
                                    loading="lazy"
                                    className="h-12 w-full object-contain"
                                />
                                <span className="line-clamp-2 text-xs text-muted-foreground">
                                    {clientLogo.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </DetailSection>
            )}

            {testimonials.length > 0 && (
                <DetailSection
                    eyebrow="Testimoni"
                    title={`Kata pengguna ${product.name}`}
                >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <figure
                                key={testimonial.id}
                                className="site-card flex flex-col gap-4 p-6"
                            >
                                <QuoteIcon className="size-6 text-primary/40" />
                                <blockquote className="flex-1 text-sm leading-relaxed">
                                    {testimonial.quote}
                                </blockquote>
                                <figcaption className="flex items-center gap-3 border-t border-dashed pt-4">
                                    <Avatar className="size-10">
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
                    </div>
                </DetailSection>
            )}

            {otherProducts.length > 0 && (
                <DetailSection eyebrow="Produk kami" title="Produk lainnya">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {otherProducts.map((otherProduct) => (
                            <ProductCard
                                key={otherProduct.id}
                                product={otherProduct}
                            />
                        ))}
                    </div>
                </DetailSection>
            )}
        </>
    );
}

ProductShow.layout = {
    inner: true,
};
