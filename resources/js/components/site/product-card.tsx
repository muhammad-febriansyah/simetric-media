import { Link } from '@inertiajs/react';
import { ArrowRightIcon, BoxIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
                'flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card p-1.5 shadow-sm ring-1 ring-border',
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
            className="group flex rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <Card className="w-full gap-0 overflow-hidden py-0 transition-shadow group-hover:shadow-lg">
                {product.cover_image_url ? (
                    <img
                        src={product.cover_image_url}
                        alt={product.name}
                        className="aspect-video w-full border-b object-cover object-top"
                    />
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-accent text-accent-foreground">
                        <BoxIcon className="size-10" />
                    </div>
                )}
                <CardContent className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex items-center gap-3">
                        <ProductLogo product={product} className="size-11" />
                        <div className="flex min-w-0 flex-col gap-1">
                            <h3 className="truncate text-lg leading-snug font-semibold group-hover:text-primary">
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
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {product.tagline}
                        </p>
                    )}
                    <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-primary">
                        Lihat produk
                        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                </CardContent>
            </Card>
        </Link>
    );
}
