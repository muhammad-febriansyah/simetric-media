import { Head } from '@inertiajs/react';
import { CheckCircle2Icon, ClockIcon } from 'lucide-react';
import { FaqList } from '@/components/site/faq-list';
import { SectionHeading } from '@/components/site/section-heading';
import { home, howWeWork } from '@/routes';
import type { Faq, ProcessStep } from '@/types';

type Props = {
    process: ProcessStep[];
    faqs: Faq[];
};

export default function HowWeWork({ process, faqs }: Props) {
    return (
        <>
            <Head title="Cara Kami Bekerja" />

            <ol className="relative flex flex-col gap-5">
                <span
                    aria-hidden="true"
                    className="absolute top-8 bottom-8 left-[3.625rem] hidden w-px border-l-2 border-dashed border-primary/20 md:block"
                />
                {process.map((step, position) => (
                    <li
                        key={step.title}
                        className="site-card relative grid gap-5 p-6 md:grid-cols-[auto_1fr_17rem] md:items-start md:gap-8 md:p-8"
                    >
                        <span className="relative flex size-13 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md shadow-primary/30">
                            {String(position + 1).padStart(2, '0')}
                        </span>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-success">
                                Tahap {position + 1}
                            </span>
                            <h2 className="text-xl font-bold md:text-2xl">
                                {step.title}
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                        <dl className="flex flex-col gap-4 rounded-2xl bg-muted/60 p-5">
                            <div className="flex flex-col gap-1">
                                <dt className="text-xs font-medium text-muted-foreground">
                                    Hasil yang Anda terima
                                </dt>
                                <dd className="flex items-start gap-2 text-sm font-semibold">
                                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                                    {step.deliverable}
                                </dd>
                            </div>
                            <div className="flex flex-col gap-1">
                                <dt className="text-xs font-medium text-muted-foreground">
                                    Perkiraan durasi
                                </dt>
                                <dd className="flex items-center gap-2 text-sm font-semibold">
                                    <ClockIcon className="size-4 shrink-0 text-primary" />
                                    {step.duration}
                                </dd>
                            </div>
                        </dl>
                    </li>
                ))}
            </ol>

            {faqs.length > 0 && (
                <section className="flex flex-col gap-8 pt-8">
                    <SectionHeading
                        align="center"
                        eyebrow="Tanya jawab"
                        title="Pertanyaan seputar proses kami"
                    />
                    <FaqList faqs={faqs} />
                </section>
            )}
        </>
    );
}

HowWeWork.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Cara Kami Bekerja', href: howWeWork() },
    ],
    eyebrow: 'Proses A sampai Z',
    title: 'Cara Kami Bekerja',
    description:
        'Tujuh tahap pendampingan dari konsultasi awal sampai solusi berjalan di perusahaan Anda. Setiap tahap punya hasil yang bisa Anda lihat.',
};
