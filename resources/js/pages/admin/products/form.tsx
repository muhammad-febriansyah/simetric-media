import { Form, Head } from '@inertiajs/react';
import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import { FormActions } from '@/components/admin/form-actions';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { ImageUploadField } from '@/components/admin/image-upload-field';
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
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/products';
import type { Product } from '@/types';

export default function ProductForm({ product }: { product: Product | null }) {
    const title = product ? 'Edit Produk' : 'Tambah Produk';
    const formAction = product
        ? ProductController.update.form(product.id)
        : ProductController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Produk', href: index() },
                    {
                        title: product ? product.name : 'Tambah',
                        href: product ? edit(product.id) : create(),
                    },
                ]}
                title={title}
                description="Produk digital milik perusahaan, ditampilkan sebagai bukti kemampuan membangun aplikasi sampai live."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <div className="flex flex-col gap-6 xl:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi produk</CardTitle>
                                        <CardDescription>
                                            Nama, kategori, dan penjelasan
                                            singkat produk.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-5">
                                            <div className="grid gap-5 md:grid-cols-2">
                                                <FormField
                                                    label="Nama produk"
                                                    htmlFor="name"
                                                    required
                                                    error={errors.name}
                                                >
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        required
                                                        defaultValue={
                                                            product?.name
                                                        }
                                                        placeholder="Contoh: ChatCepat"
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
                                                            product?.category ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: Omnichannel & AI"
                                                    />
                                                </FormField>
                                            </div>
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
                                                            product?.slug
                                                        }
                                                        placeholder="contoh: chatcepat"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="URL website"
                                                    htmlFor="website_url"
                                                    error={errors.website_url}
                                                >
                                                    <Input
                                                        id="website_url"
                                                        name="website_url"
                                                        type="url"
                                                        defaultValue={
                                                            product?.website_url ??
                                                            ''
                                                        }
                                                        placeholder="https://www.produk-anda.id"
                                                    />
                                                </FormField>
                                            </div>
                                            <FormField
                                                label="Tagline"
                                                htmlFor="tagline"
                                                error={errors.tagline}
                                            >
                                                <Input
                                                    id="tagline"
                                                    name="tagline"
                                                    defaultValue={
                                                        product?.tagline ?? ''
                                                    }
                                                    placeholder="Contoh: Semua channel chat dalam satu inbox, dibalas AI otomatis."
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
                                                        product?.summary ?? ''
                                                    }
                                                    placeholder="Masalah yang diselesaikan produk ini, dalam 1-2 kalimat."
                                                />
                                            </FormField>
                                            <FormField
                                                label="Penjelasan detail"
                                                htmlFor="body"
                                                error={errors.body}
                                            >
                                                <RichTextEditor
                                                    id="body"
                                                    name="body"
                                                    label="Penjelasan detail"
                                                    defaultValue={product?.body}
                                                    placeholder="Siapa penggunanya, cara kerjanya, dan peran tim kita dalam membangunnya."
                                                    invalid={Boolean(
                                                        errors.body,
                                                    )}
                                                />
                                            </FormField>
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Gambar</CardTitle>
                                        <CardDescription>
                                            Logo produk dan tangkapan layar
                                            aplikasi.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup className="gap-5">
                                            <ImageUploadField
                                                name="logo"
                                                label="Logo"
                                                description="JPG, PNG, WEBP, atau SVG. Maksimal 1 MB."
                                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                                currentUrl={product?.logo_url}
                                                error={errors.logo}
                                            />
                                            <ImageUploadField
                                                name="cover_image"
                                                label="Gambar cover"
                                                description="Tangkapan layar aplikasi. JPG, PNG, atau WEBP. Maksimal 2 MB."
                                                accept="image/jpeg,image/png,image/webp"
                                                currentUrl={
                                                    product?.cover_image_url
                                                }
                                                error={errors.cover_image}
                                                previewClassName="aspect-video h-auto w-full sm:w-56 [&_img]:object-cover [&_img]:p-0"
                                            />
                                        </FieldGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Fitur utama</CardTitle>
                                        <CardDescription>
                                            Kemampuan utama produk. Maksimal 12.
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
                                                        'Contoh: Inbox omnichannel',
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
                                                product?.features ?? []
                                            }
                                            errors={errors}
                                            addLabel="Tambah fitur"
                                            maxRows={12}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Angka sorotan</CardTitle>
                                        <CardDescription>
                                            Maksimal 4 angka, misalnya "Bisnis
                                            pengguna: 500+".
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RepeatableFields
                                            name="highlights"
                                            fields={[
                                                {
                                                    key: 'label',
                                                    label: 'Label',
                                                    placeholder:
                                                        'Contoh: Bisnis pengguna',
                                                    required: true,
                                                },
                                                {
                                                    key: 'value',
                                                    label: 'Nilai',
                                                    placeholder: 'Contoh: 500+',
                                                    required: true,
                                                },
                                            ]}
                                            initialRows={
                                                product?.highlights ?? []
                                            }
                                            errors={errors}
                                            addLabel="Tambah angka"
                                            maxRows={4}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col gap-6">
                                <PublicationCard
                                    isPublished={product?.is_published ?? true}
                                    sortOrder={product?.sort_order ?? 0}
                                    error={errors.sort_order}
                                >
                                    <CheckboxField
                                        id="is_featured"
                                        name="is_featured"
                                        label="Tampilkan di Beranda"
                                        description="Produk unggulan tampil di section Produk Kami."
                                        defaultChecked={
                                            product?.is_featured ?? true
                                        }
                                    />
                                </PublicationCard>
                                <SeoCard
                                    metaTitle={product?.meta_title}
                                    metaDescription={product?.meta_description}
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
