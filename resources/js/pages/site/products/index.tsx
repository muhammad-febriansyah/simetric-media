import { Head } from '@inertiajs/react';
import { ProductCard } from '@/components/site/product-card';
import { SiteEmpty } from '@/components/site/site-empty';
import { home } from '@/routes';
import { index } from '@/routes/products';
import type { Product } from '@/types';

export default function ProductIndex({ products }: { products: Product[] }) {
    return (
        <>
            <Head title="Portfolio" />

            {products.length === 0 ? (
                <SiteEmpty
                    title="Portfolio segera hadir"
                    description="Hubungi kami untuk mengetahui produk digital yang sedang kami kembangkan."
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </>
    );
}

ProductIndex.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Portfolio', href: index() },
    ],
    eyebrow: 'Portfolio',
    title: 'Portfolio Kami',
    description:
        'Platform digital yang kami bangun dan jalankan sendiri, bukti bahwa kami mengawal ide sampai menjadi aplikasi yang dipakai banyak orang.',
};
