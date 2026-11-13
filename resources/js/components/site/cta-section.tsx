import { Link } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { create as consultationCreate } from '@/routes/consultation';

export function CtaSection() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-6">
            <div className="flex flex-col items-start gap-6 rounded-2xl bg-primary px-6 py-10 text-primary-foreground md:flex-row md:items-center md:justify-between md:px-12">
                <div className="flex max-w-2xl flex-col gap-3">
                    <h2 className="text-2xl font-semibold md:text-3xl">
                        Belum yakin solusi apa yang Anda butuhkan?
                    </h2>
                    <p className="text-primary-foreground/80">
                        Ceritakan masalah bisnis Anda. Kami bantu petakan dulu,
                        gratis dan tanpa komitmen.
                    </p>
                </div>
                <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="bg-card text-primary hover:bg-card/90"
                >
                    <Link href={consultationCreate()}>
                        Konsultasi Gratis
                        <ArrowRightIcon data-icon="inline-end" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}
