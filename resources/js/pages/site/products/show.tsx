import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    CheckCircle2Icon,
    ExternalLinkIcon,
    QuoteIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { RichText } from '@/components/rich-text';
import { ProductCard, ProductLogo } from '@/components/site/product-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

            <PageHeader {...pageHeader} />

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <Card className="gap-0 overflow-hidden py-0 lg:col-span-2">
                    {product.cover_image_url && (
                        <img
                            src={product.cover_image_url}
                            alt={product.name}
                            className="aspect-video w-full border-b object-cover object-top"
                        />
                    )}
                    <CardContent className="flex flex-col gap-6 p-6">
                        <div className="flex items-center gap-4">
                            <ProductLogo
                                product={product}
                                className="size-14"
                            />
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xl font-semibold">
                                    {product.name}
                                </span>
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
                            <p className="text-lg font-medium">
                                {product.summary}
                            </p>
                        )}
                        {product.body && (
                            <RichText
                                html={product.body}
                                className="text-muted-foreground"
                            />
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    {product.highlights.length > 0 && (
                        <Card>
                            <CardContent className="grid grid-cols-2 gap-4">
                                {product.highlights.map((highlight) => (
                                    <div
                                        key={highlight.label}
                                        className="flex flex-col gap-1 rounded-xl bg-muted p-4"
                                    >
                                        <span className="text-2xl font-bold text-primary">
                                            {highlight.value}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {highlight.label}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Fitur utama</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            {product.features.length > 0 && (
                                <ul className="flex flex-col gap-4">
                                    {product.features.map((feature) => (
                                        <li
                                            key={feature.title}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                                            <span className="flex flex-col gap-0.5">
                                                <span className="text-sm font-medium">
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
                            )}
                            <div className="flex flex-col gap-3">
                                {product.website_url && (
                                    <Button asChild>
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
                                <Button variant="secondary" asChild>
                                    <Link href={consultationCreate()}>
                                        Bangun produk serupa
                                        <ArrowRightIcon data-icon="inline-end" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {clientLogos.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Klien &amp; mitra</CardTitle>
                        <CardDescription>
                            Sebagian bisnis yang memakai dan bekerja sama dengan{' '}
                            {product.name}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {clientLogos.map((clientLogo) => (
                            <div
                                key={clientLogo.id}
                                className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 text-center ring-1 ring-border"
                            >
                                <img
                                    src={clientLogo.logo_url}
                                    alt={`Logo ${clientLogo.name}`}
                                    loading="lazy"
                                    className="h-14 w-full object-contain"
                                />
                                <span className="line-clamp-2 text-xs text-muted-foreground">
                                    {clientLogo.name}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {testimonials.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Kata pengguna {product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <figure
                                key={testimonial.id}
                                className="flex flex-col gap-4 rounded-xl bg-muted p-5"
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
                    </CardContent>
                </Card>
            )}

            {otherProducts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Produk lainnya</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {otherProducts.map((otherProduct) => (
                            <ProductCard
                                key={otherProduct.id}
                                product={otherProduct}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}
        </>
    );
}

ProductShow.layout = {
    inner: true,
};
