import { Form, Head } from '@inertiajs/react';
import CompanyMilestoneController from '@/actions/App/Http/Controllers/Admin/CompanyMilestoneController';
import { FormActions } from '@/components/admin/form-actions';
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
import { create, edit, index } from '@/routes/admin/milestones';
import type { CompanyMilestone } from '@/types';

export default function MilestoneForm({
    companyMilestone,
}: {
    companyMilestone: CompanyMilestone | null;
}) {
    const title = companyMilestone ? 'Edit Milestone' : 'Tambah Milestone';
    const formAction = companyMilestone
        ? CompanyMilestoneController.update.form(companyMilestone.id)
        : CompanyMilestoneController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Perjalanan Perusahaan', href: index() },
                    {
                        title: companyMilestone
                            ? String(companyMilestone.year)
                            : 'Tambah',
                        href: companyMilestone
                            ? edit(companyMilestone.id)
                            : create(),
                    },
                ]}
                title={title}
                description="Momen penting yang membentuk perusahaan."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <Card className="max-w-3xl">
                            <CardHeader>
                                <CardTitle>Detail milestone</CardTitle>
                                <CardDescription>
                                    Diurutkan berdasarkan tahun, lalu urutan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldGroup className="gap-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <FormField
                                            label="Tahun"
                                            htmlFor="year"
                                            required
                                            error={errors.year}
                                        >
                                            <Input
                                                id="year"
                                                name="year"
                                                type="number"
                                                min={1900}
                                                required
                                                defaultValue={
                                                    companyMilestone?.year
                                                }
                                                placeholder="Contoh: 2021"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Urutan dalam tahun"
                                            htmlFor="sort_order"
                                            error={errors.sort_order}
                                        >
                                            <Input
                                                id="sort_order"
                                                name="sort_order"
                                                type="number"
                                                min={0}
                                                defaultValue={
                                                    companyMilestone?.sort_order ??
                                                    0
                                                }
                                                placeholder="0"
                                            />
                                        </FormField>
                                    </div>
                                    <FormField
                                        label="Judul"
                                        htmlFor="title"
                                        required
                                        error={errors.title}
                                    >
                                        <Input
                                            id="title"
                                            name="title"
                                            required
                                            defaultValue={
                                                companyMilestone?.title
                                            }
                                            placeholder="Contoh: Perusahaan resmi berdiri"
                                        />
                                    </FormField>
                                    <FormField
                                        label="Deskripsi"
                                        htmlFor="description"
                                        error={errors.description}
                                    >
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={
                                                companyMilestone?.description ??
                                                ''
                                            }
                                            placeholder="Ceritakan singkat apa yang terjadi."
                                        />
                                    </FormField>
                                </FieldGroup>
                            </CardContent>
                        </Card>

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
