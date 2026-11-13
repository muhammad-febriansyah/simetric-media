import { Head, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    Building2Icon,
    CheckIcon,
    ClockIcon,
    ClipboardListIcon,
    MailIcon,
    PhoneIcon,
    SendIcon,
    UserIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import ConsultationController from '@/actions/App/Http/Controllers/Site/ConsultationController';
import { OptionSelect } from '@/components/admin/option-select';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { create } from '@/routes/consultation';
import type { Option } from '@/types';

type Props = {
    industryOptions: Option[];
    companySizeOptions: Option[];
    problemAreaOptions: Option[];
    timelineOptions: Option[];
    budgetOptions: Option[];
};

type ConsultationForm = {
    name: string;
    email: string;
    phone: string;
    job_title: string;
    company_name: string;
    industry_id: string;
    company_size: string;
    problem_area: string;
    problem_description: string;
    timeline: string;
    budget_range: string;
    source_page: string;
    utm: Record<string, string>;
    website: string;
};

type FieldName = keyof ConsultationForm;

type Step = {
    title: string;
    description: string;
    icon: LucideIcon;
    fields: FieldName[];
    required: FieldName[];
};

const STEPS: Step[] = [
    {
        title: 'Data diri',
        description: 'Siapa yang bisa kami hubungi?',
        icon: UserIcon,
        fields: ['name', 'email', 'phone', 'job_title'],
        required: ['name', 'email', 'phone'],
    },
    {
        title: 'Perusahaan',
        description: 'Ceritakan sedikit tentang perusahaan Anda.',
        icon: Building2Icon,
        fields: ['company_name', 'industry_id', 'company_size'],
        required: ['company_name'],
    },
    {
        title: 'Kebutuhan',
        description: 'Masalah apa yang ingin diselesaikan?',
        icon: ClipboardListIcon,
        fields: [
            'problem_area',
            'problem_description',
            'timeline',
            'budget_range',
        ],
        required: ['problem_area', 'problem_description'],
    },
];

const NONE = 'none';
const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'];

export default function ConsultationCreate({
    industryOptions,
    companySizeOptions,
    problemAreaOptions,
    timelineOptions,
    budgetOptions,
}: Props) {
    const { company } = usePage().props;
    const [step, setStep] = useState(0);
    const [stepErrors, setStepErrors] = useState<
        Partial<Record<FieldName, string>>
    >({});

    const form = useForm<ConsultationForm>({
        name: '',
        email: '',
        phone: '',
        job_title: '',
        company_name: '',
        industry_id: '',
        company_size: '',
        problem_area: '',
        problem_description: '',
        timeline: '',
        budget_range: '',
        source_page: '',
        utm: {},
        website: '',
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const utm = Object.fromEntries(
            UTM_KEYS.flatMap((key) => {
                const value = params.get(`utm_${key}`);

                return value ? [[key, value]] : [];
            }),
        );

        form.setData((data) => ({
            ...data,
            source_page: document.referrer.slice(0, 255),
            utm,
        }));
        // Run once on mount to capture where the visitor came from.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const errors: Partial<Record<FieldName, string>> = {
        ...stepErrors,
        ...(form.errors as Partial<Record<FieldName, string>>),
    };

    const setField = (field: FieldName, value: string) => {
        form.setData(field, value as never);
        setStepErrors((current) => ({ ...current, [field]: undefined }));
        form.clearErrors(field);
    };

    const validateStep = (index: number): boolean => {
        const missing = STEPS[index].required.filter((field) => {
            const value = form.data[field];

            return typeof value !== 'string' || value.trim() === '';
        });

        setStepErrors(
            Object.fromEntries(
                missing.map((field) => [field, 'Kolom ini wajib diisi.']),
            ),
        );

        return missing.length === 0;
    };

    const goNext = () => {
        if (validateStep(step)) {
            setStep((current) => Math.min(current + 1, STEPS.length - 1));
        }
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (step < STEPS.length - 1) {
            goNext();

            return;
        }

        if (!validateStep(step)) {
            return;
        }

        form.transform((data) => ({
            ...data,
            industry_id: data.industry_id === NONE ? '' : data.industry_id,
        }));

        form.post(ConsultationController.store.url(), {
            onError: (serverErrors) => {
                const firstStepWithError = STEPS.findIndex((item) =>
                    item.fields.some((field) => field in serverErrors),
                );

                if (firstStepWithError >= 0) {
                    setStep(firstStepWithError);
                }
            },
        });
    };

    const isLastStep = step === STEPS.length - 1;

    return (
        <>
            <Head title="Konsultasi Gratis" />

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="gap-6">
                        <ol className="grid grid-cols-3 gap-2">
                            {STEPS.map((item, position) => (
                                <li
                                    key={item.title}
                                    className="flex flex-col gap-2"
                                >
                                    <span
                                        className={cn(
                                            'h-1.5 rounded-full bg-muted',
                                            position <= step && 'bg-primary',
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'flex items-center gap-2 text-xs font-semibold text-muted-foreground sm:text-sm',
                                            position === step && 'text-primary',
                                        )}
                                    >
                                        {position < step ? (
                                            <CheckIcon className="size-4" />
                                        ) : (
                                            <item.icon className="size-4" />
                                        )}
                                        <span className="hidden sm:inline">
                                            {item.title}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <div className="flex flex-col gap-1.5">
                            <CardTitle>
                                Langkah {step + 1}: {STEPS[step].title}
                            </CardTitle>
                            <CardDescription>
                                {STEPS[step].description}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="flex flex-col gap-8"
                            noValidate
                        >
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                className="hidden"
                                value={form.data.website}
                                onChange={(event) =>
                                    setField('website', event.target.value)
                                }
                            />

                            {step === 0 && (
                                <FieldGroup className="gap-5">
                                    <FormField
                                        label="Nama lengkap"
                                        htmlFor="name"
                                        required
                                        error={errors.name}
                                    >
                                        <Input
                                            id="name"
                                            value={form.data.name}
                                            onChange={(event) =>
                                                setField(
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="name"
                                            placeholder="Contoh: Budi Santoso"
                                        />
                                    </FormField>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <FormField
                                            label="Email kerja"
                                            htmlFor="email"
                                            required
                                            error={errors.email}
                                        >
                                            <Input
                                                id="email"
                                                type="email"
                                                value={form.data.email}
                                                onChange={(event) =>
                                                    setField(
                                                        'email',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="email"
                                                placeholder="nama@perusahaan.com"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Nomor WhatsApp"
                                            htmlFor="phone"
                                            required
                                            error={errors.phone}
                                        >
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={form.data.phone}
                                                onChange={(event) =>
                                                    setField(
                                                        'phone',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="tel"
                                                placeholder="Contoh: 0812 3456 7890"
                                            />
                                        </FormField>
                                    </div>
                                    <FormField
                                        label="Jabatan"
                                        htmlFor="job_title"
                                        error={errors.job_title}
                                    >
                                        <Input
                                            id="job_title"
                                            value={form.data.job_title}
                                            onChange={(event) =>
                                                setField(
                                                    'job_title',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="organization-title"
                                            placeholder="Contoh: Manajer Operasional"
                                        />
                                    </FormField>
                                </FieldGroup>
                            )}

                            {step === 1 && (
                                <FieldGroup className="gap-5">
                                    <FormField
                                        label="Nama perusahaan"
                                        htmlFor="company_name"
                                        required
                                        error={errors.company_name}
                                    >
                                        <Input
                                            id="company_name"
                                            value={form.data.company_name}
                                            onChange={(event) =>
                                                setField(
                                                    'company_name',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="organization"
                                            placeholder="Contoh: PT Maju Jaya"
                                        />
                                    </FormField>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <FormField
                                            label="Industri"
                                            htmlFor="industry_id"
                                            error={errors.industry_id}
                                        >
                                            <OptionSelect
                                                id="industry_id"
                                                name="industry_id"
                                                options={industryOptions}
                                                defaultValue={
                                                    form.data.industry_id ||
                                                    undefined
                                                }
                                                emptyValue={NONE}
                                                emptyLabel="Lainnya / belum ada"
                                                placeholder="Pilih industri"
                                                onValueChange={(value) =>
                                                    setField(
                                                        'industry_id',
                                                        value,
                                                    )
                                                }
                                            />
                                        </FormField>
                                        <FormField
                                            label="Ukuran perusahaan"
                                            htmlFor="company_size"
                                            error={errors.company_size}
                                        >
                                            <OptionSelect
                                                id="company_size"
                                                name="company_size"
                                                options={companySizeOptions}
                                                defaultValue={
                                                    form.data.company_size ||
                                                    undefined
                                                }
                                                placeholder="Pilih jumlah karyawan"
                                                onValueChange={(value) =>
                                                    setField(
                                                        'company_size',
                                                        value,
                                                    )
                                                }
                                            />
                                        </FormField>
                                    </div>
                                </FieldGroup>
                            )}

                            {step === 2 && (
                                <FieldGroup className="gap-5">
                                    <FormField
                                        label="Area masalah"
                                        htmlFor="problem_area"
                                        required
                                        error={errors.problem_area}
                                    >
                                        <OptionSelect
                                            id="problem_area"
                                            name="problem_area"
                                            options={problemAreaOptions}
                                            defaultValue={
                                                form.data.problem_area ||
                                                undefined
                                            }
                                            placeholder="Pilih area yang paling bermasalah"
                                            onValueChange={(value) =>
                                                setField('problem_area', value)
                                            }
                                        />
                                    </FormField>
                                    <FormField
                                        label="Ceritakan masalahnya"
                                        htmlFor="problem_description"
                                        required
                                        description="Tidak perlu istilah teknis. Ceritakan apa yang terjadi sehari-hari."
                                        error={errors.problem_description}
                                    >
                                        <Textarea
                                            id="problem_description"
                                            rows={6}
                                            value={
                                                form.data.problem_description
                                            }
                                            onChange={(event) =>
                                                setField(
                                                    'problem_description',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Stok gudang sering tidak sama dengan catatan penjualan, laporan ke direksi butuh 3 hari."
                                        />
                                    </FormField>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <FormField
                                            label="Target waktu"
                                            htmlFor="timeline"
                                            error={errors.timeline}
                                        >
                                            <OptionSelect
                                                id="timeline"
                                                name="timeline"
                                                options={timelineOptions}
                                                defaultValue={
                                                    form.data.timeline ||
                                                    undefined
                                                }
                                                placeholder="Kapan ingin mulai?"
                                                onValueChange={(value) =>
                                                    setField('timeline', value)
                                                }
                                            />
                                        </FormField>
                                        <FormField
                                            label="Kisaran budget"
                                            htmlFor="budget_range"
                                            error={errors.budget_range}
                                        >
                                            <OptionSelect
                                                id="budget_range"
                                                name="budget_range"
                                                options={budgetOptions}
                                                defaultValue={
                                                    form.data.budget_range ||
                                                    undefined
                                                }
                                                placeholder="Pilih kisaran budget"
                                                onValueChange={(value) =>
                                                    setField(
                                                        'budget_range',
                                                        value,
                                                    )
                                                }
                                            />
                                        </FormField>
                                    </div>
                                </FieldGroup>
                            )}

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                                {step > 0 ? (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setStep(step - 1)}
                                    >
                                        <ArrowLeftIcon data-icon="inline-start" />
                                        Kembali
                                    </Button>
                                ) : (
                                    <span />
                                )}
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    {form.processing ? (
                                        <Spinner data-icon="inline-start" />
                                    ) : isLastStep ? (
                                        <SendIcon data-icon="inline-start" />
                                    ) : (
                                        <ArrowRightIcon data-icon="inline-start" />
                                    )}
                                    {isLastStep
                                        ? 'Kirim permintaan konsultasi'
                                        : 'Lanjut'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Setelah Anda mengirim</CardTitle>
                        <CardDescription>
                            Gratis dan tanpa komitmen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <ol className="flex flex-col gap-4">
                            {[
                                'Tim kami menghubungi Anda maksimal 1 hari kerja.',
                                'Konsultasi awal untuk memahami masalah bisnis Anda.',
                                'Anda menerima gambaran solusi dan langkah berikutnya.',
                            ].map((item, position) => (
                                <li key={item} className="flex gap-3 text-sm">
                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                                        {position + 1}
                                    </span>
                                    <span className="pt-1">{item}</span>
                                </li>
                            ))}
                        </ol>
                        <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 text-sm">
                            <span className="font-semibold">
                                Lebih suka langsung bicara?
                            </span>
                            <a
                                href={`mailto:${company.contact.email}`}
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                            >
                                <MailIcon className="size-4" />
                                {company.contact.email}
                            </a>
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <PhoneIcon className="size-4" />
                                {company.contact.phone}
                            </span>
                            {company.contact.business_hours && (
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <ClockIcon className="size-4" />
                                    {company.contact.business_hours}
                                </span>
                            )}
                        </div>
                        {company.contact.maps_embed_url && (
                            <iframe
                                src={company.contact.maps_embed_url}
                                title="Lokasi kantor di Google Maps"
                                className="aspect-video w-full rounded-xl border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ConsultationCreate.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Konsultasi Gratis', href: create() },
    ],
    title: 'Konsultasi Gratis',
    description:
        'Ceritakan masalah bisnis Anda dalam 3 langkah singkat. Kami bantu petakan solusinya.',
    showCta: false,
};
