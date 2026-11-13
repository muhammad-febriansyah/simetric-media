import { Head } from '@inertiajs/react';
import { ProductCard } from '@/components/site/product-card';
import { Card, CardContent } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import { home } from '@/routes';
import { index } from '@/routes/products';
import type { Product } from '@/types';

export default function ProductIndex({ products }: { products: Product[] }) {
    return (
        <>
            <Head title="Produk" />

            {products.length === 0 ? (
                <Card>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle>Produk segera hadir</EmptyTitle>
                                <EmptyDescription>
                                    Hubungi kami untuk mengetahui produk digital
                                    yang sedang kami kembangkan.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </CardContent>
                </Card>
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
        { title: 'Produk', href: index() },
    ],
    title: 'Produk Kami',
    description:
        'Platform digital yang kami bangun dan jalankan sendiri, bukti bahwa kami mengawal ide sampai menjadi aplikasi yang dipakai banyak orang.',
};
