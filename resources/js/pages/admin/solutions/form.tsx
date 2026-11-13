import { Form, Head } from '@inertiajs/react';
import SolutionController from '@/actions/App/Http/Controllers/Admin/SolutionController';
import { FormActions } from '@/components/admin/form-actions';
import { IconSelect } from '@/components/admin/icon-select';
import { OptionSelect } from '@/components/admin/option-select';
import { PublicationCard } from '@/components/admin/publication-card';
import { RepeatableFields } from '@/components/admin/repeatable-fields';
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
import { create, edit, index } from '@/routes/admin/solutions';
import type { Option, Solution } from '@/types';

type Props = {
    solution: Solution | null;
    businessFunctionOptions: Option[];
};

export default function SolutionForm({
    solution,
    businessFunctionOptions,
}: Props) {
    const title = solution ? 'Edit Solusi' : 'Tambah Solusi';
    const formAction = solution
        ? SolutionController.update.form(solution.id)
        : SolutionController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Solusi', href: index() },
                    {
                        title: solution ? solution.name : 'Tambah',
                        href: solution ? edit(solution.id) : create(),
                    },
                ]}
                title={title}
                description="Solusi ditulis dari masalah yang dialami divisi bisnis klien."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <div className="flex flex-col gap-6 xl:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi solusi</CardTitle>
                                        <CardDescription>
                                            Nama, divisi bisnis, dan kalimat
                                            pembuka.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-5">
                                            <FormField
                                                label="Nama solusi"
                                                htmlFor="name"
                                                required
                                                error={errors.name}
                                            >
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    defaultValue={
                                                        solution?.name
                                                    }
                                                    placeholder="Contoh: Sistem Order & Penagihan Terintegrasi"
                                                />
                                            </FormField>
                                            <div className="grid gap-5 md:grid-cols-2">
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
                                                            solution?.slug
                                                        }
                                                        placeholder="contoh: sistem-order-penagihan"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Divisi bisnis"
                                                    htmlFor="business_function"
                                                    required
                                                    error={
                                                        errors.business_function
                                                    }
                                                >
                                                    <OptionSelect
                                                        id="business_function"
                                                        name="business_function"
                                                        options={
                                                            businessFunctionOptions
                                                        }
                                                        defaultValue={
                                                            solution
                                                                ?.business_function
                                                                .value
                                                        }
                                                        placeholder="Pilih divisi bisnis"
                                                    />
                                                </FormField>
                                            </div>
                                            <FormField
                                                label="Headline (masalah klien)"
                                                htmlFor="headline"
                                                error={errors.headline}
                                            >
                                                <Input
                                                    id="headline"
                                                    name="headline"
                                                    defaultValue={
                                                        solution?.headline ?? ''
                                                    }
                                                    placeholder="Contoh: Tagihan sering terlambat karena data order tidak terhubung?"
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
                                                    defaultValue={
                                                        solution?.icon
                                                    }
                                                />
                                            </FormField>
                                            <FormField
                                                label="Masalah yang diselesaikan"
                                                htmlFor="problem_statement"
                                                error={errors.problem_statement}
                                            >
                                                <Textarea
                                                    id="problem_statement"
                                                    name="problem_statement"
                                                    defaultValue={
                                                        solution?.problem_statement ??
                                                        ''
                                                    }
                                                    placeholder="Jelaskan masalah yang dialami divisi ini."
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
                                                    rows={6}
                                                    defaultValue={
                                                        solution?.body ?? ''
                                                    }
                                                    placeholder="Cara kerja solusi dan manfaatnya untuk tim klien."
                                                />
                                            </FormField>
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Fitur utama</CardTitle>
                                        <CardDescription>
                                            Kemampuan yang didapat klien.
                                            Maksimal 12.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RepeatableFields
                                            name="features"
                                            fields={[
                                                {
                                                    key: 'title',
                                                    label: 'Judul',
                                                    placeholder:
                                                        'Contoh: Order otomatis jadi invoice',
                                                    required: true,
                                                },
                                                {
                                                    key: 'description',
                                                    label: 'Deskripsi',
                                                    placeholder:
                                                        'Jelaskan manfaat fitur ini.',
                                                    multiline: true,
                                                },
                                            ]}
                                            initialRows={
                                                solution?.features ?? []
                                            }
                                            errors={errors}
                                            addLabel="Tambah fitur"
                                            maxRows={12}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col gap-6">
                                <PublicationCard
                                    isPublished={solution?.is_published ?? true}
                                    sortOrder={solution?.sort_order ?? 0}
                                    error={errors.sort_order}
                                />
                                <SeoCard
                                    metaTitle={solution?.meta_title}
                                    metaDescription={solution?.meta_description}
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
