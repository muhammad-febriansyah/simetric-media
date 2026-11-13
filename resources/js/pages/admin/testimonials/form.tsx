import { Form, Head } from '@inertiajs/react';
import TestimonialController from '@/actions/App/Http/Controllers/Admin/TestimonialController';
import { FormActions } from '@/components/admin/form-actions';
import { OptionSelect } from '@/components/admin/option-select';
import { PhotoField } from '@/components/admin/photo-field';
import { VisibilityCard } from '@/components/admin/visibility-card';
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
import { create, edit, index } from '@/routes/admin/testimonials';
import type { Option, Testimonial } from '@/types';

type Props = {
    testimonial: Testimonial | null;
    caseStudyOptions: Option[];
};

const NONE = 'none';

export default function TestimonialForm({
    testimonial,
    caseStudyOptions,
}: Props) {
    const title = testimonial ? 'Edit Testimoni' : 'Tambah Testimoni';
    const formAction = testimonial
        ? TestimonialController.update.form(testimonial.id)
        : TestimonialController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Testimoni', href: index() },
                    {
                        title: testimonial ? testimonial.author_name : 'Tambah',
                        href: testimonial ? edit(testimonial.id) : create(),
                    },
                ]}
                title={title}
                description="Pastikan klien sudah menyetujui kutipannya ditampilkan."
            />

            <Form
                {...formAction}
                className="flex flex-col gap-6"
                transform={(data) => ({
                    ...data,
                    case_study_id:
                        data.case_study_id === NONE ? null : data.case_study_id,
                })}
            >
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Isi testimoni</CardTitle>
                                    <CardDescription>
                                        Kutipan apa adanya dari klien.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <FormField
                                            label="Testimoni"
                                            htmlFor="quote"
                                            required
                                            error={errors.quote}
                                        >
                                            <Textarea
                                                id="quote"
                                                name="quote"
                                                required
                                                rows={5}
                                                defaultValue={
                                                    testimonial?.quote
                                                }
                                                placeholder="Contoh: Tim memahami proses bisnis kami sebelum menawarkan solusi."
                                            />
                                        </FormField>
                                        <PhotoField
                                            currentUrl={testimonial?.photo_url}
                                            alt={
                                                testimonial?.author_name ??
                                                'Foto'
                                            }
                                            error={errors.photo}
                                        />
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label="Nama pemberi testimoni"
                                                htmlFor="author_name"
                                                required
                                                error={errors.author_name}
                                            >
                                                <Input
                                                    id="author_name"
                                                    name="author_name"
                                                    required
                                                    defaultValue={
                                                        testimonial?.author_name
                                                    }
                                                    placeholder="Contoh: Budi Santoso"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Jabatan"
                                                htmlFor="author_position"
                                                error={errors.author_position}
                                            >
                                                <Input
                                                    id="author_position"
                                                    name="author_position"
                                                    defaultValue={
                                                        testimonial?.author_position ??
                                                        ''
                                                    }
                                                    placeholder="Contoh: Direktur Operasional"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Perusahaan"
                                                htmlFor="company"
                                                error={errors.company}
                                            >
                                                <Input
                                                    id="company"
                                                    name="company"
                                                    defaultValue={
                                                        testimonial?.company ??
                                                        ''
                                                    }
                                                    placeholder="Contoh: PT Maju Jaya"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Studi kasus terkait"
                                                htmlFor="case_study_id"
                                                error={errors.case_study_id}
                                            >
                                                <OptionSelect
                                                    id="case_study_id"
                                                    name="case_study_id"
                                                    options={caseStudyOptions}
                                                    defaultValue={
                                                        testimonial?.case_study
                                                            ? String(
                                                                  testimonial
                                                                      .case_study
                                                                      .id,
                                                              )
                                                            : NONE
                                                    }
                                                    emptyValue={NONE}
                                                    emptyLabel="Tidak terkait"
                                                    placeholder="Pilih studi kasus"
                                                />
                                            </FormField>
                                        </div>
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            <VisibilityCard
                                isActive={testimonial?.is_active ?? true}
                                sortOrder={testimonial?.sort_order ?? 0}
                                error={errors.sort_order}
                            />
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
