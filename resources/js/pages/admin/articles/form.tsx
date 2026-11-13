import { Form, Head } from '@inertiajs/react';
import ArticleController from '@/actions/App/Http/Controllers/Admin/ArticleController';
import { FormActions } from '@/components/admin/form-actions';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { PublicationCard } from '@/components/admin/publication-card';
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
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/articles';
import type { Article, Option } from '@/types';

type Props = {
    article: Article | null;
    serviceOptions: Option[];
};

export default function ArticleForm({ article, serviceOptions }: Props) {
    const title = article ? 'Edit Artikel' : 'Tulis Artikel';
    const selectedServiceIds = new Set(
        article?.services?.map((service) => String(service.id)) ?? [],
    );
    const formAction = article
        ? ArticleController.update.form(article.id)
        : ArticleController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Insight', href: index() },
                    {
                        title: article ? article.title : 'Tulis',
                        href: article ? edit(article.id) : create(),
                    },
                ]}
                title={title}
                description="Bagikan keahlian lewat artikel yang menjawab masalah calon klien."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Isi artikel</CardTitle>
                                    <CardDescription>
                                        Pisahkan paragraf dengan baris kosong.
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
                                                defaultValue={article?.title}
                                                placeholder="Contoh: 5 Tanda Pabrik Anda Siap Digitalisasi"
                                            />
                                        </FormField>
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label="Slug"
                                                htmlFor="slug"
                                                description="Kosongkan untuk dibuat otomatis dari judul."
                                                error={errors.slug}
                                            >
                                                <Input
                                                    id="slug"
                                                    name="slug"
                                                    defaultValue={article?.slug}
                                                    placeholder="contoh: tanda-pabrik-siap-digitalisasi"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Kategori"
                                                htmlFor="category"
                                                error={errors.category}
                                            >
                                                <Input
                                                    id="category"
                                                    name="category"
                                                    defaultValue={
                                                        article?.category ?? ''
                                                    }
                                                    placeholder="Contoh: Strategi"
                                                />
                                            </FormField>
                                        </div>
                                        <FormField
                                            label="Ringkasan"
                                            htmlFor="excerpt"
                                            description="Maksimal 300 karakter, tampil di kartu artikel."
                                            error={errors.excerpt}
                                        >
                                            <Textarea
                                                id="excerpt"
                                                name="excerpt"
                                                maxLength={300}
                                                defaultValue={
                                                    article?.excerpt ?? ''
                                                }
                                                placeholder="Satu atau dua kalimat inti artikel."
                                            />
                                        </FormField>
                                        <FormField
                                            label="Isi artikel"
                                            htmlFor="body"
                                            required
                                            error={errors.body}
                                        >
                                            <Textarea
                                                id="body"
                                                name="body"
                                                required
                                                rows={16}
                                                defaultValue={article?.body}
                                                placeholder="Tulis isi artikel di sini."
                                            />
                                        </FormField>
                                        <ImageUploadField
                                            name="cover_image"
                                            label="Gambar cover"
                                            description="JPG, PNG, atau WEBP. Maksimal 2 MB."
                                            accept="image/jpeg,image/png,image/webp"
                                            currentUrl={
                                                article?.cover_image_url
                                            }
                                            error={errors.cover_image}
                                            previewClassName="aspect-video h-auto w-full sm:w-56 [&_img]:object-cover [&_img]:p-0"
                                        />
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-6">
                                <PublicationCard
                                    isPublished={article?.is_published ?? false}
                                    sortOrder={0}
                                    hideSortOrder
                                />
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Layanan terkait</CardTitle>
                                        <CardDescription>
                                            Artikel tampil di halaman layanan
                                            yang dipilih.
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
                                        </FieldGroup>
                                    </CardContent>
                                </Card>
                                <SeoCard
                                    metaTitle={article?.meta_title}
                                    metaDescription={article?.meta_description}
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
