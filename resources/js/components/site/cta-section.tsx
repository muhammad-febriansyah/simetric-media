import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRightIcon,
    CheckIcon,
    MapIcon,
    MessageCircleIcon,
    RocketIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { whatsappUrl } from '@/lib/whatsapp';
import { create as consultationCreate } from '@/routes/consultation';

/** Small white cards that illustrate the journey on the banner's right side. */
function JourneyPreview() {
    return (
        <div
            aria-hidden="true"
            className="relative hidden h-64 text-foreground lg:block"
        >
            <div className="absolute top-2 left-6 flex w-64 items-center gap-3 rounded-2xl bg-card p-4 shadow-xl">
                <span className="flex size-10 items-center justify-center rounded-xl bg-success text-white">
                    <CheckIcon className="size-5" />
                </span>
                <span className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                        Tahap 2
                    </span>
                    <span className="text-sm font-semibold">
                        Assessment selesai
                    </span>
                </span>
            </div>
            <div className="absolute top-24 right-0 flex w-72 flex-col gap-3 rounded-2xl bg-card p-4 shadow-xl">
                <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <MapIcon className="size-5" />
                    </span>
                    <span className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                            Tahap 3
                        </span>
                        <span className="text-sm font-semibold">
                            Roadmap disetujui
                        </span>
                    </span>
                </span>
                <span className="h-2 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full w-2/3 rounded-full bg-primary" />
                </span>
            </div>
            <div className="absolute bottom-0 left-0 flex w-60 items-center gap-3 rounded-2xl bg-card p-4 shadow-xl">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <RocketIcon className="size-5" />
                </span>
                <span className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                        Tahap 6
                    </span>
                    <span className="text-sm font-semibold">Aplikasi live</span>
                </span>
            </div>
        </div>
    );
}

/**
 * Closing call to action on every public page: a navy banner with the
 * consultation and WhatsApp buttons.
 */
export function CtaSection() {
    const { company } = usePage().props;
    const whatsappLink = whatsappUrl(company.contact.whatsapp);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-6">
            <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-navy px-6 py-10 text-navy-foreground md:px-12 md:py-14 lg:grid-cols-[1.3fr_1fr]">
                <div className="flex flex-col items-start gap-4">
                    <span className="text-sm font-semibold text-success md:text-base">
                        Konsultasi gratis
                    </span>
                    <h2 className="text-2xl leading-tight font-bold text-balance md:text-[2rem]">
                        Belum yakin solusi apa yang Anda butuhkan?
                    </h2>
                    <p className="max-w-xl leading-relaxed text-white/70">
                        Ceritakan masalah bisnis Anda. Kami bantu petakan dulu,
                        gratis dan tanpa komitmen.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                        <Button size="lg" asChild>
                            <Link href={consultationCreate()}>
                                Konsultasi Gratis
                                <ArrowRightIcon data-icon="inline-end" />
                            </Link>
                        </Button>
                        {whatsappLink && (
                            <Button
                                size="lg"
                                variant="secondary"
                                asChild
                                className="bg-white text-navy hover:bg-white/90"
                            >
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
                    </div>
                </div>
                <JourneyPreview />
            </div>
        </section>
    );
}
