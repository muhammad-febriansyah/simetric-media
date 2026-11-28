import { Link } from '@inertiajs/react';
import { ArrowRightIcon, BoxIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { show } from '@/routes/products';
import type { Product } from '@/types';

export function ProductLogo({
    product,
    className = 'size-12',
}: {
    product: Product;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card p-1.5 ring-1 ring-border',
                className,
            )}
        >
            {product.logo_url ? (
                <img
                    src={product.logo_url}
                    alt={`Logo ${product.name}`}
                    className="size-full object-contain"
                />
            ) : (
                <BoxIcon className="size-5 text-primary" />
            )}
        </span>
    );
}

export function ProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={show(product.slug)}
            className="group flex w-full rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <div className="site-card site-card-interactive flex w-full flex-col gap-6 p-6 md:p-7.5">
                {product.cover_image_url ? (
                    <img
                        src={product.cover_image_url}
                        alt={product.name}
                        loading="lazy"
                        className="aspect-video w-full rounded-2xl object-cover object-top ring-1 ring-border"
                    />
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                        <BoxIcon className="size-12" />
                    </div>
                )}
                <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <ProductLogo product={product} className="size-11" />
                        <div className="flex min-w-0 flex-col gap-1">
                            <h3 className="truncate text-xl font-bold">
                                {product.name}
                            </h3>
                            {product.category && (
                                <Badge variant="secondary" className="w-fit">
                                    {product.category}
                                </Badge>
                            )}
                        </div>
                    </div>
                    {product.tagline && (
                        <p className="line-clamp-2 font-light text-muted-foreground">
                            {product.tagline}
                        </p>
                    )}
                </div>
                <span className="flex items-center gap-1.5 font-semibold text-primary">
                    Lihat portfolio
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
        </Link>
    );
}
