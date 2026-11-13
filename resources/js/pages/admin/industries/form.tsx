import { Form, Head } from '@inertiajs/react';
import IndustryController from '@/actions/App/Http/Controllers/Admin/IndustryController';
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
import { create, edit, index } from '@/routes/admin/industries';
import type { Industry } from '@/types';

export default function IndustryForm({
    industry,
}: {
    industry: Industry | null;
}) {
    const title = industry ? 'Edit Industri' : 'Tambah Industri';

    const pageHeader = {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Industri', href: index() },
            {
                title: industry ? industry.name : 'Tambah',
                href: industry ? edit(industry.id) : create(),
            },
        ],
        title,
        description: 'Tulis masalah umum industri dari sudut pandang klien.',
    };

    const formAction = industry
        ? IndustryController.update.form(industry.id)
        : IndustryController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader {...pageHeader} />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Informasi industri</CardTitle>
                                    <CardDescription>
                                        Tampil di halaman Industri dan form
                                        konsultasi.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <FormField
                                            label="Nama industri"
                                            htmlFor="name"
                                            required
                                            error={errors.name}
                                        >
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                defaultValue={industry?.name}
                                                placeholder="Contoh: Manufaktur"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Slug"
                                            htmlFor="slug"
                                            description="Dipakai di URL. Kosongkan untuk dibuat otomatis dari nama."
                                            error={errors.slug}
                                        >
                                            <Input
                                                id="slug"
                                                name="slug"
                                                defaultValue={industry?.slug}
                                                placeholder="contoh: manufaktur"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Ringkasan"
                                            htmlFor="summary"
                                            error={errors.summary}
                                        >
                                            <Textarea
                                                id="summary"
                                                name="summary"
                                                defaultValue={
                                                    industry?.summary ?? ''
                                                }
                                                placeholder="Contoh: Pabrik dengan proses produksi dan gudang yang masih manual."
                                            />
                                        </FormField>
                                        <FormField
                                            label="Masalah umum"
                                            htmlFor="pain_points"
                                            description="Satu masalah per baris."
                                            error={
                                                errors.pain_points ??
                                                errors['pain_points.0']
                                            }
                                        >
                                            <Textarea
                                                id="pain_points"
                                                name="pain_points"
                                                rows={5}
                                                defaultValue={industry?.pain_points.join(
                                                    '\n',
                                                )}
                                                placeholder={
                                                    'Data produksi tersebar di Excel\nStok bahan baku tidak sinkron'
                                                }
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
                                                defaultValue={industry?.icon}
                                            />
                                        </FormField>
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-6">
                                <PublicationCard
                                    isPublished={industry?.is_published ?? true}
                                    sortOrder={industry?.sort_order ?? 0}
                                    error={errors.sort_order}
                                />
                                <SeoCard
                                    metaTitle={industry?.meta_title}
                                    metaDescription={industry?.meta_description}
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
