import { Form, Head } from '@inertiajs/react';
import ServiceController from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { FormActions } from '@/components/admin/form-actions';
import { IconSelect } from '@/components/admin/icon-select';
import { PublicationCard } from '@/components/admin/publication-card';
import { RepeatableFields } from '@/components/admin/repeatable-fields';
import type { RepeatableFieldDefinition } from '@/components/admin/repeatable-fields';
import { SeoCard } from '@/components/admin/seo-card';
import { FormField } from '@/components/form-field';
import { PageHeader } from '@/components/page-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/services';
import type { Option, Service } from '@/types';

type Props = {
    service: Service | null;
    pillarOptions: Option[];
};

function titledItemFields(
    titlePlaceholder: string,
    descriptionPlaceholder: string,
): RepeatableFieldDefinition[] {
    return [
        {
            key: 'title',
            label: 'Judul',
            placeholder: titlePlaceholder,
            required: true,
        },
        {
            key: 'description',
            label: 'Deskripsi',
            placeholder: descriptionPlaceholder,
            multiline: true,
        },
    ];
}

export default function ServiceForm({ service, pillarOptions }: Props) {
    const title = service ? 'Edit Layanan' : 'Tambah Layanan';

    const pageHeader = {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Layanan', href: index() },
            {
                title: service ? service.name : 'Tambah',
                href: service ? edit(service.id) : create(),
            },
        ],
        title,
        description: 'Mulai dari masalah klien, baru jelaskan solusinya.',
    };

    const formAction = service
        ? ServiceController.update.form(service.id)
        : ServiceController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader {...pageHeader} />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <div className="flex flex-col gap-6 xl:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi layanan</CardTitle>
                                        <CardDescription>
                                            Nama, pilar, dan kalimat pembuka
                                            layanan.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-5">
                                            <FormField
                                                label="Nama layanan"
                                                htmlFor="name"
                                                required
                                                error={errors.name}
                                            >
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    defaultValue={service?.name}
                                                    placeholder="Contoh: Konsultasi & Assessment Digital"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Slug"
                                                htmlFor="slug"
                                                description="Kosongkan untuk dibuat otomatis dari nama."
                                                error={errors.slug}
                                            >
                                                <Input
                                                    id="slug"
                                                    name="slug"
                                                    defaultValue={service?.slug}
                                                    placeholder="contoh: konsultasi-assessment-digital"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Pilar layanan"
                                                htmlFor="pillar"
                                                required
                                                error={errors.pillar}
                                            >
                                                <Select
                                                    name="pillar"
                                                    defaultValue={
                                                        service?.pillar.value
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id="pillar"
                                                        className="w-full"
                                                    >
                                                        <SelectValue placeholder="Pilih pilar layanan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {pillarOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormField>
                                            <FormField
                                                label="Headline (masalah klien)"
                                                htmlFor="headline"
                                                error={errors.headline}
                                            >
                                                <Input
                                                    id="headline"
                                                    name="headline"
                                                    defaultValue={
                                                        service?.headline ?? ''
                                                    }
                                                    placeholder="Contoh: Belum tahu teknologi apa yang tepat untuk bisnis Anda?"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Ikon"
                                                htmlFor="icon"
                                                description="Ikon tampil di kartu website."
                                                error={errors.icon}
                                            >
                                                <IconSelect
                                                    id="icon"
                                                    name="icon"
                                                    defaultValue={service?.icon}
                                                />
                                            </FormField>
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Isi layanan</CardTitle>
                                        <CardDescription>
                                            Tampil di halaman detail layanan.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-5">
                                            <FormField
                                                label="Masalah yang diselesaikan"
                                                htmlFor="problem_statement"
                                                error={errors.problem_statement}
                                            >
                                                <Textarea
                                                    id="problem_statement"
                                                    name="problem_statement"
                                                    defaultValue={
                                                        service?.problem_statement ??
                                                        ''
                                                    }
                                                    placeholder="Jelaskan masalah klien yang diselesaikan layanan ini."
                                                />
                                            </FormField>
                                            <FormField
                                                label="Penjelasan detail"
                                                htmlFor="body"
                                                error={errors.body}
                                            >
                                                <Textarea
                                                    id="body"
                                                    name="body"
                                                    rows={8}
                                                    defaultValue={
                                                        service?.body ?? ''
                                                    }
                                                    placeholder="Pendekatan, cakupan pekerjaan, dan cara kerja tim."
                                                />
                                            </FormField>
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Kemampuan</CardTitle>
                                        <CardDescription>
                                            Sub-layanan yang termasuk,
                                            masing-masing dengan penjelasan
                                            singkat. Maksimal 12.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RepeatableFields
                                            name="capabilities"
                                            fields={titledItemFields(
                                                'Contoh: Digital Maturity Assessment',
                                                'Contoh: Mengukur kesiapan digital tiap divisi.',
                                            )}
                                            initialRows={
                                                service?.capabilities ?? []
                                            }
                                            errors={errors}
                                            addLabel="Tambah kemampuan"
                                            maxRows={12}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Metodologi</CardTitle>
                                        <CardDescription>
                                            Tahapan kerja layanan ini secara
                                            berurutan. Maksimal 10.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RepeatableFields
                                            name="methodology"
                                            fields={titledItemFields(
                                                'Contoh: Pemetaan proses bisnis',
                                                'Contoh: Wawancara tiap divisi dan observasi lapangan.',
                                            )}
                                            initialRows={
                                                service?.methodology ?? []
                                            }
                                            errors={errors}
                                            addLabel="Tambah tahap"
                                            maxRows={10}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col gap-6">
                                <PublicationCard
                                    isPublished={service?.is_published ?? true}
                                    sortOrder={service?.sort_order ?? 0}
                                    error={errors.sort_order}
                                />
                                <SeoCard
                                    metaTitle={service?.meta_title}
                                    metaDescription={service?.meta_description}
                                    errors={errors}
                                />
                            </div>
                        </div>

                        <FormActions
                            cancelHref={index()}
                            processing={processing}
                        />
                    </>
                )}
            </Form>
        </>
    );
}
