import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2Icon,
    FolderKanbanIcon,
    HomeIcon,
    MessageCircleIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { whatsappUrl } from '@/lib/whatsapp';
import { home } from '@/routes';
import { index as caseStudiesIndex } from '@/routes/case-studies';
import { create, thanks } from '@/routes/consultation';

const NEXT_STEPS = [
    'Tim kami menghubungi Anda maksimal 1 hari kerja.',
    'Konsultasi awal untuk memahami masalah bisnis Anda.',
    'Anda menerima gambaran solusi dan langkah berikutnya.',
];

export default function ConsultationThanks() {
    const { company } = usePage().props;
    const whatsappLink = whatsappUrl(
        company.contact.whatsapp,
        'Halo, saya baru saja mengirim permintaan konsultasi lewat website.',
    );

    return (
        <>
            <Head title="Terima Kasih" />

            <section className="site-card mx-auto flex w-full max-w-2xl flex-col items-center gap-8 p-8 text-center md:p-12">
                <span className="flex size-20 items-center justify-center rounded-full bg-success/15 text-success">
                    <CheckCircle2Icon className="size-10" />
                </span>
                <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-bold md:text-3xl">
                        Permintaan Anda sudah kami terima
                    </h2>
                    <p className="leading-relaxed text-muted-foreground">
                        Sambil menunggu, lihat bagaimana kami membantu
                        perusahaan lain.
                    </p>
                </div>
                <ol className="flex w-full flex-col gap-3 text-left">
                    {NEXT_STEPS.map((item, position) => (
                        <li
                            key={item}
                            className="flex items-center gap-4 rounded-2xl bg-muted/60 p-4 text-sm"
                        >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {position + 1}
                            </span>
                            {item}
                        </li>
                    ))}
                </ol>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                    <Button asChild>
                        <Link href={caseStudiesIndex()}>
                            <FolderKanbanIcon data-icon="inline-start" />
                            Lihat studi kasus
                        </Link>
                    </Button>
                    {whatsappLink && (
                        <Button variant="secondary" asChild>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircleIcon data-icon="inline-start" />
                                Chat WhatsApp
                            </a>
                        </Button>
                    )}
                    <Button variant="secondary" asChild>
                        <Link href={home()}>
                            <HomeIcon data-icon="inline-start" />
                            Kembali ke beranda
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}

ConsultationThanks.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Konsultasi Gratis', href: create() },
        { title: 'Terima Kasih', href: thanks() },
    ],
    eyebrow: 'Konsultasi gratis',
    title: 'Terima Kasih',
    description: 'Langkah pertama menuju solusi sudah dimulai.',
    showCta: false,
};
