import { Head, Link } from '@inertiajs/react';
import { CheckCircle2Icon, FolderKanbanIcon, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { home } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create, thanks } from '@/routes/consultation';

export default function ConsultationThanks() {
    return (
        <>
            <Head title="Terima Kasih" />

            <Card className="mx-auto w-full max-w-2xl">
                <CardContent className="flex flex-col items-center gap-6 py-6 text-center">
                    <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
                        <CheckCircle2Icon className="size-8" />
                    </span>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold">
                            Permintaan Anda sudah kami terima
                        </h2>
                        <p className="text-muted-foreground">
                            Tim kami akan menghubungi Anda maksimal 1 hari kerja
                            untuk menjadwalkan konsultasi awal. Sambil menunggu,
                            lihat bagaimana kami membantu perusahaan lain.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button variant="secondary" asChild>
                            <Link href={home()}>
                                <HomeIcon data-icon="inline-start" />
                                Kembali ke beranda
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={caseStudiesIndex()}>
                                <FolderKanbanIcon data-icon="inline-start" />
                                Lihat studi kasus
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

ConsultationThanks.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Konsultasi Gratis', href: create() },
        { title: 'Terima Kasih', href: thanks() },
    ],
    title: 'Terima Kasih',
    description: 'Langkah pertama menuju solusi sudah dimulai.',
    showCta: false,
};
