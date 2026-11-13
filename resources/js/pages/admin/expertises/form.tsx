import { Form, Head } from '@inertiajs/react';
import ExpertiseController from '@/actions/App/Http/Controllers/Admin/ExpertiseController';
import { FormActions } from '@/components/admin/form-actions';
import { IconSelect } from '@/components/admin/icon-select';
import { PublicationCard } from '@/components/admin/publication-card';
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
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/expertises';
import type { Expertise } from '@/types';

export default function ExpertiseForm({
    expertise,
}: {
    expertise: Expertise | null;
}) {
    const title = expertise ? 'Edit Bidang Keahlian' : 'Tambah Bidang Keahlian';
    const formAction = expertise
        ? ExpertiseController.update.form(expertise.id)
        : ExpertiseController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Bidang Keahlian', href: index() },
                    {
                        title: expertise ? expertise.name : 'Tambah',
                        href: expertise ? edit(expertise.id) : create(),
                    },
                ]}
                title={title}
                description="Bidang keahlian tampil sebagai pilar di halaman Keahlian, lengkap dengan layanan di dalamnya."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Informasi bidang</CardTitle>
                                    <CardDescription>
                                        Nama, ikon, dan satu kalimat manfaat
                                        untuk klien.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label="Nama bidang"
                                                htmlFor="name"
                                                required
                                                error={errors.name}
                                            >
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    defaultValue={
                                                        expertise?.name
                                                    }
                                                    placeholder="Contoh: Konsultasi & Strategi"
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
                                                    defaultValue={
                                                        expertise?.slug
                                                    }
                                                    placeholder="contoh: konsultasi-strategi"
                                                />
                                            </FormField>
                                        </div>
                                        <FormField
                                            label="Ikon"
                                            htmlFor="icon"
                                            description="Ikon tampil di samping nama bidang di website."
                                            error={errors.icon}
                                        >
                                            <IconSelect
                                                id="icon"
                                                name="icon"
                                                defaultValue={expertise?.icon}
                                            />
                                        </FormField>
                                        <FormField
                                            label="Deskripsi"
                                            htmlFor="description"
                                            required
                                            description="Satu atau dua kalimat manfaat untuk klien. Maksimal 300 karakter."
                                            error={errors.description}
                                        >
                                            <Textarea
                                                id="description"
                                                name="description"
                                                required
                                                maxLength={300}
                                                defaultValue={
                                                    expertise?.description ?? ''
                                                }
                                                placeholder="Contoh: Memetakan masalah bisnis dan menyusun roadmap digital yang realistis."
                                            />
                                        </FormField>
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-6">
                                <PublicationCard
                                    isPublished={
                                        expertise?.is_published ?? true
                                    }
                                    sortOrder={expertise?.sort_order ?? 0}
                                    error={errors.sort_order}
                                />
                                <SeoCard
                                    metaTitle={expertise?.meta_title}
                                    metaDescription={
                                        expertise?.meta_description
                                    }
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
