import { Form, Head } from '@inertiajs/react';
import CaseStudyController from '@/actions/App/Http/Controllers/Admin/CaseStudyController';
import { FormActions } from '@/components/admin/form-actions';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { OptionSelect } from '@/components/admin/option-select';
import { PublicationCard } from '@/components/admin/publication-card';
import { RepeatableFields } from '@/components/admin/repeatable-fields';
import { SeoCard } from '@/components/admin/seo-card';
import { CheckboxField } from '@/components/checkbox-field';
import { FormField } from '@/components/form-field';
import { PageHeader } from '@/components/page-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/case-studies';
import type { CaseStudy, Option } from '@/types';

type Props = {
    caseStudy: CaseStudy | null;
    organizationTypeOptions: Option[];
    industryOptions: Option[];
    serviceOptions: Option[];
    solutionOptions: Option[];
};

const NONE = 'none';

export default function CaseStudyForm({
    caseStudy,
    organizationTypeOptions,
    industryOptions,
    serviceOptions,
    solutionOptions,
}: Props) {
    const title = caseStudy ? 'Edit Studi Kasus' : 'Tambah Studi Kasus';
    const selectedServiceIds = new Set(
        caseStudy?.services?.map((service) => String(service.id)) ?? [],
    );
    const selectedSolutionIds = new Set(
        caseStudy?.solutions?.map((solution) => String(solution.id)) ?? [],
    );

    const pageHeader = {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Studi Kasus', href: index() },
            {
                title: caseStudy ? caseStudy.title : 'Tambah',
                href: caseStudy ? edit(caseStudy.id) : create(),
            },
        ],
        title,
        description:
            'Ceritakan perjalanan konsultasi: tantangan, temuan, rekomendasi, solusi, dan hasil.',
    };

    const formAction = caseStudy
        ? CaseStudyController.update.form(caseStudy.id)
        : CaseStudyController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader {...pageHeader} />

            <Form
                {...formAction}
                className="flex flex-col gap-6"
                transform={(data) => ({
                    ...data,
                    industry_id:
                        data.industry_id === NONE ? null : data.industry_id,
                    organization_type:
                        data.organization_type === NONE
                            ? null
                            : data.organization_type,
                })}
            >
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <div className="flex flex-col gap-6 xl:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi utama</CardTitle>
                                        <CardDescription>
                                            Tampil di kartu studi kasus dan
                                            halaman detail.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-5">
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
                                                        caseStudy?.title
                                                    }
                                                    placeholder="Contoh: Digitalisasi Pencatatan Produksi Pabrik"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Slug"
                                                htmlFor="slug"
                                                description="Kosongkan untuk dibuat otomatis dari judul."
                                                error={errors.slug}
                                            >
                                                <Input
                                                    id="slug"
                                                    name="slug"
                                                    defaultValue={
                                                        caseStudy?.slug
                                                    }
                                                    placeholder="contoh: digitalisasi-pencatatan-produksi"
                                                />
                                            </FormField>
                                            <div className="grid gap-5 md:grid-cols-2">
                                                <FormField
                                                    label="Nama klien"
                                                    htmlFor="client_name"
                                                    required
                                                    description="Boleh disamarkan."
                                                    error={errors.client_name}
                                                >
                                                    <Input
                                                        id="client_name"
                                                        name="client_name"
                                                        required
                                                        defaultValue={
                                                            caseStudy?.client_name
                                                        }
                                                        placeholder="Contoh: Produsen Komponen Otomotif"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Periode proyek"
                                                    htmlFor="project_period"
                                                    error={
                                                        errors.project_period
                                                    }
                                                >
                                                    <Input
                                                        id="project_period"
                                                        name="project_period"
                                                        defaultValue={
                                                            caseStudy?.project_period ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: 2025 - Sekarang"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Industri"
                                                    htmlFor="industry_id"
                                                    error={errors.industry_id}
                                                >
                                                    <OptionSelect
                                                        id="industry_id"
                                                        name="industry_id"
                                                        options={
                                                            industryOptions
                                                        }
                                                        defaultValue={
                                                            caseStudy?.industry
                                                                ? String(
                                                                      caseStudy
                                                                          .industry
                                                                          .id,
                                                                  )
                                                                : NONE
                                                        }
                                                        emptyValue={NONE}
                                                        emptyLabel="Tanpa industri"
                                                        placeholder="Pilih industri"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Tipe organisasi"
                                                    htmlFor="organization_type"
                                                    error={
                                                        errors.organization_type
                                                    }
                                                >
                                                    <OptionSelect
                                                        id="organization_type"
                                                        name="organization_type"
                                                        options={
                                                            organizationTypeOptions
                                                        }
                                                        defaultValue={
                                                            caseStudy
                                                                ?.organization_type
                                                                ?.value ?? NONE
                                                        }
                                                        emptyValue={NONE}
                                                        emptyLabel="Tidak ditentukan"
                                                        placeholder="Pilih tipe organisasi"
                                                    />
                                                </FormField>
                                            </div>
                                            <FormField
                                                label="Ringkasan"
                                                htmlFor="excerpt"
                                                description="Maksimal 300 karakter, tampil di kartu."
                                                error={errors.excerpt}
                                            >
                                                <Textarea
                                                    id="excerpt"
                                                    name="excerpt"
                                                    maxLength={300}
                                                    defaultValue={
                                                        caseStudy?.excerpt ?? ''
                                                    }
                                                    placeholder="Contoh: Dari laporan kertas menjadi dashboard real-time."
                                                />
                                            </FormField>
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Gambar</CardTitle>
                                        <CardDescription>
                                            Cover tampil di kartu, galeri tampil
                                            di halaman detail (atur caption dan
                                            urutannya). JPG, PNG, atau WEBP,
                                            maksimal 2 MB per gambar.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-5">
                                            <ImageUploadField
                                                name="cover_image"
                                                label="Gambar cover"
                                                description="Tampil di kartu studi kasus. Ukuran ideal 16:9."
                                                accept="image/jpeg,image/png,image/webp"
                                                currentUrl={
                                                    caseStudy?.cover_image_url
                                                }
                                                error={errors.cover_image}
                                                previewClassName="aspect-video h-auto w-full sm:w-56 [&_img]:object-cover [&_img]:p-0"
                                            />

                                            <ImageUploadField
                                                name="gallery_images[]"
                                                label="Tambah gambar galeri"
                                                description="Bisa pilih beberapa gambar sekaligus, maksimal 10."
                                                accept="image/jpeg,image/png,image/webp"
                                                multiple
                                                error={
                                                    errors.gallery_images ??
                                                    errors['gallery_images.0']
                                                }
                                            />
                                            {caseStudy?.images &&
                                                caseStudy.images.length > 0 && (
                                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                        {caseStudy.images.map(
                                                            (image) => (
                                                                <div
                                                                    key={
                                                                        image.id
                                                                    }
                                                                    className="flex flex-col gap-2 rounded-xl bg-muted p-2"
                                                                >
                                                                    <img
                                                                        src={
                                                                            image.url
                                                                        }
                                                                        alt={
                                                                            image.caption ??
                                                                            `Galeri ${caseStudy.title}`
                                                                        }
                                                                        className="aspect-video w-full rounded-lg object-cover"
                                                                    />
                                                                    <div className="grid grid-cols-[1fr_5rem] gap-2">
                                                                        <Input
                                                                            aria-label="Caption gambar"
                                                                            name={`image_captions[${image.id}]`}
                                                                            defaultValue={
                                                                                image.caption ??
                                                                                ''
                                                                            }
                                                                            className="h-9"
                                                                            placeholder="Caption (opsional)"
                                                                        />
                                                                        <Input
                                                                            aria-label="Urutan gambar"
                                                                            name={`image_sort_orders[${image.id}]`}
                                                                            type="number"
                                                                            min={
                                                                                0
                                                                            }
                                                                            defaultValue={
                                                                                image.sort_order
                                                                            }
                                                                            className="h-9"
                                                                            placeholder="Urutan"
                                                                        />
                                                                    </div>
                                                                    <CheckboxField
                                                                        id={`remove-image-${image.id}`}
                                                                        name="remove_image_ids[]"
                                                                        value={String(
                                                                            image.id,
                                                                        )}
                                                                        label="Hapus gambar ini"
                                                                    />
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Perjalanan konsultasi
                                        </CardTitle>
                                        <CardDescription>
                                            Struktur ini yang membedakan kita
                                            dari vendor biasa.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-5">
                                            <FormField
                                                label="Tantangan"
                                                htmlFor="challenge"
                                                required
                                                error={errors.challenge}
                                            >
                                                <Textarea
                                                    id="challenge"
                                                    name="challenge"
                                                    required
                                                    rows={4}
                                                    defaultValue={
                                                        caseStudy?.challenge
                                                    }
                                                    placeholder="Masalah bisnis yang dihadapi klien sebelum bekerja sama."
                                                />
                                            </FormField>
                                            <FormField
                                                label="Temuan assessment"
                                                htmlFor="assessment"
                                                error={errors.assessment}
                                            >
                                                <Textarea
                                                    id="assessment"
                                                    name="assessment"
                                                    rows={4}
                                                    defaultValue={
                                                        caseStudy?.assessment ??
                                                        ''
                                                    }
                                                    placeholder="Apa yang ditemukan saat memetakan proses dan sistem klien."
                                                />
                                            </FormField>
                                            <FormField
                                                label="Rekomendasi"
                                                htmlFor="recommendation"
                                                error={errors.recommendation}
                                            >
                                                <Textarea
                                                    id="recommendation"
                                                    name="recommendation"
                                                    rows={4}
                                                    defaultValue={
                                                        caseStudy?.recommendation ??
                                                        ''
                                                    }
                                                    placeholder="Solusi dan prioritas yang direkomendasikan."
                                                />
                                            </FormField>
                                            <FormField
                                                label="Solusi"
                                                htmlFor="solution"
                                                required
                                                error={errors.solution}
                                            >
                                                <Textarea
                                                    id="solution"
                                                    name="solution"
                                                    required
                                                    rows={4}
                                                    defaultValue={
                                                        caseStudy?.solution
                                                    }
                                                    placeholder="Aplikasi atau sistem yang akhirnya dibangun dan diterapkan."
                                                />
                                            </FormField>
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hasil terukur</CardTitle>
                                        <CardDescription>
                                            Maksimal 6 metrik, misalnya "Waktu
                                            laporan: -80%".
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RepeatableFields
                                            name="results"
                                            fields={[
                                                {
                                                    key: 'label',
                                                    label: 'Label',
                                                    placeholder:
                                                        'Contoh: Waktu laporan',
                                                    required: true,
                                                },
                                                {
                                                    key: 'value',
                                                    label: 'Nilai',
                                                    placeholder: 'Contoh: -80%',
                                                    required: true,
                                                },
                                            ]}
                                            initialRows={
                                                caseStudy?.results ?? []
                                            }
                                            errors={errors}
                                            addLabel="Tambah metrik"
                                            maxRows={6}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Insight untuk pimpinan
                                        </CardTitle>
                                        <CardDescription>
                                            Pelajaran strategis dari proyek ini
                                            untuk level direksi. Maksimal 6.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RepeatableFields
                                            name="key_insights"
                                            fields={[
                                                {
                                                    key: 'title',
                                                    label: 'Judul',
                                                    placeholder:
                                                        'Contoh: Digitalisasi dimulai dari standar data',
                                                    required: true,
                                                },
                                                {
                                                    key: 'description',
                                                    label: 'Deskripsi',
                                                    placeholder:
                                                        'Jelaskan pelajaran yang bisa diterapkan perusahaan lain.',
                                                    multiline: true,
                                                },
                                            ]}
                                            initialRows={
                                                caseStudy?.key_insights ?? []
                                            }
                                            errors={errors}
                                            addLabel="Tambah insight"
                                            maxRows={6}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col gap-6">
                                <PublicationCard
                                    isPublished={
                                        caseStudy?.is_published ?? true
                                    }
                                    sortOrder={caseStudy?.sort_order ?? 0}
                                    error={errors.sort_order}
                                >
                                    <CheckboxField
                                        id="is_featured"
                                        name="is_featured"
                                        label="Tampilkan di Beranda"
                                        description="Maksimal 3 studi kasus unggulan yang tampil."
                                        defaultChecked={
                                            caseStudy?.is_featured ?? false
                                        }
                                    />
                                </PublicationCard>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Layanan terkait</CardTitle>
                                        <CardDescription>
                                            Studi kasus tampil di halaman
                                            layanan yang dipilih.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-4">
                                            {serviceOptions.map((option) => (
                                                <CheckboxField
                                                    key={option.value}
                                                    id={`service-${option.value}`}
                                                    name="service_ids[]"
                                                    value={option.value}
                                                    label={option.label}
                                                    defaultChecked={selectedServiceIds.has(
                                                        option.value,
                                                    )}
                                                />
                                            ))}
                                            {errors.service_ids && (
                                                <FieldError>
                                                    {errors.service_ids}
                                                </FieldError>
                                            )}
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                {solutionOptions.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Solusi terkait
                                            </CardTitle>
                                            <CardDescription>
                                                Solusi per divisi bisnis yang
                                                dipakai di proyek ini.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldGroup className="gap-4">
                                                {solutionOptions.map(
                                                    (option) => (
                                                        <CheckboxField
                                                            key={option.value}
                                                            id={`solution-${option.value}`}
                                                            name="solution_ids[]"
                                                            value={option.value}
                                                            label={option.label}
                                                            defaultChecked={selectedSolutionIds.has(
                                                                option.value,
                                                            )}
                                                        />
                                                    ),
                                                )}
                                            </FieldGroup>
                                        </CardContent>
                                    </Card>
                                )}

                                <SeoCard
                                    metaTitle={caseStudy?.meta_title}
                                    metaDescription={
                                        caseStudy?.meta_description
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
