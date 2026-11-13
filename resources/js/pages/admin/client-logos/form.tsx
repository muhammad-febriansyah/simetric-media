import { Form, Head } from '@inertiajs/react';
import ClientLogoController from '@/actions/App/Http/Controllers/Admin/ClientLogoController';
import { FormActions } from '@/components/admin/form-actions';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { OptionSelect } from '@/components/admin/option-select';
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
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/client-logos';
import type { ClientLogo, Option } from '@/types';

type Props = {
    clientLogo: ClientLogo | null;
    industryOptions: Option[];
};

const NO_INDUSTRY = 'none';

export default function ClientLogoForm({ clientLogo, industryOptions }: Props) {
    const title = clientLogo ? 'Edit Logo Klien' : 'Tambah Logo Klien';
    const formAction = clientLogo
        ? ClientLogoController.update.form(clientLogo.id)
        : ClientLogoController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Logo Klien', href: index() },
                    {
                        title: clientLogo ? clientLogo.name : 'Tambah',
                        href: clientLogo ? edit(clientLogo.id) : create(),
                    },
                ]}
                title={title}
                description="Pastikan klien sudah memberi izin logonya ditampilkan."
            />

            <Form
                {...formAction}
                className="flex flex-col gap-6"
                transform={(data) => ({
                    ...data,
                    industry_id:
                        data.industry_id === NO_INDUSTRY
                            ? null
                            : data.industry_id,
                })}
            >
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Informasi klien</CardTitle>
                                    <CardDescription>
                                        Logo dengan industri tampil juga di
                                        halaman industri tersebut.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label="Nama klien"
                                                htmlFor="name"
                                                required
                                                error={errors.name}
                                            >
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    defaultValue={
                                                        clientLogo?.name
                                                    }
                                                    placeholder="Contoh: PT Maju Jaya"
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
                                                    options={industryOptions}
                                                    defaultValue={
                                                        clientLogo?.industry
                                                            ? String(
                                                                  clientLogo
                                                                      .industry
                                                                      .id,
                                                              )
                                                            : NO_INDUSTRY
                                                    }
                                                    emptyValue={NO_INDUSTRY}
                                                    emptyLabel="Tanpa industri"
                                                    placeholder="Pilih industri"
                                                />
                                            </FormField>
                                        </div>
                                        <FormField
                                            label="Website"
                                            htmlFor="website_url"
                                            error={errors.website_url}
                                        >
                                            <Input
                                                id="website_url"
                                                name="website_url"
                                                type="url"
                                                defaultValue={
                                                    clientLogo?.website_url ??
                                                    ''
                                                }
                                                placeholder="https://perusahaan.com"
                                            />
                                        </FormField>
                                        <ImageUploadField
                                            name="logo"
                                            label="Logo"
                                            required={!clientLogo}
                                            removable={false}
                                            description={
                                                clientLogo
                                                    ? 'Kosongkan jika tidak ingin mengganti logo. PNG, SVG, JPG, atau WEBP, maksimal 1 MB.'
                                                    : 'PNG, SVG, JPG, atau WEBP, maksimal 1 MB. Sebaiknya latar transparan.'
                                            }
                                            accept="image/png,image/svg+xml,image/jpeg,image/webp"
                                            currentUrl={clientLogo?.logo_url}
                                            error={errors.logo}
                                            previewClassName="h-20 w-40"
                                        />
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tampilan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <CheckboxField
                                            id="is_active"
                                            name="is_active"
                                            label="Tampilkan di website"
                                            defaultChecked={
                                                clientLogo?.is_active ?? true
                                            }
                                        />
                                        <FormField
                                            label="Urutan tampil"
                                            htmlFor="sort_order"
                                            error={errors.sort_order}
                                        >
                                            <Input
                                                id="sort_order"
                                                name="sort_order"
                                                type="number"
                                                min={0}
                                                defaultValue={
                                                    clientLogo?.sort_order ?? 0
                                                }
                                                placeholder="0"
                                            />
                                        </FormField>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
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
