import { Form, Head } from '@inertiajs/react';
import OfficeController from '@/actions/App/Http/Controllers/Admin/OfficeController';
import { FormActions } from '@/components/admin/form-actions';
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
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/offices';
import type { Office, Option } from '@/types';

type Props = {
    office: Office | null;
    typeOptions: Option[];
};

export default function OfficeForm({ office, typeOptions }: Props) {
    const title = office ? 'Edit Kantor' : 'Tambah Kantor';
    const formAction = office
        ? OfficeController.update.form(office.id)
        : OfficeController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Kantor', href: index() },
                    {
                        title: office ? office.name : 'Tambah',
                        href: office ? edit(office.id) : create(),
                    },
                ]}
                title={title}
                description="Alamat dan kontak kantor yang tampil di website."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Informasi kantor</CardTitle>
                                    <CardDescription>
                                        Kantor pusat tampil paling atas.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label="Nama kantor"
                                                htmlFor="name"
                                                required
                                                error={errors.name}
                                            >
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    defaultValue={office?.name}
                                                    placeholder="Contoh: Kantor Pusat Jakarta"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Tipe kantor"
                                                htmlFor="type"
                                                required
                                                error={errors.type}
                                            >
                                                <OptionSelect
                                                    id="type"
                                                    name="type"
                                                    options={typeOptions}
                                                    defaultValue={
                                                        office?.type.value ??
                                                        'branch'
                                                    }
                                                    placeholder="Pilih tipe kantor"
                                                />
                                            </FormField>
                                        </div>
                                        <FormField
                                            label="Alamat"
                                            htmlFor="address"
                                            required
                                            error={errors.address}
                                        >
                                            <Textarea
                                                id="address"
                                                name="address"
                                                required
                                                defaultValue={office?.address}
                                                placeholder="Contoh: Jl. Jend. Sudirman No. 1, Gedung A Lt. 5"
                                            />
                                        </FormField>
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label="Kota"
                                                htmlFor="city"
                                                required
                                                error={errors.city}
                                            >
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    required
                                                    defaultValue={office?.city}
                                                    placeholder="Contoh: Jakarta"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Telepon"
                                                htmlFor="phone"
                                                error={errors.phone}
                                            >
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    defaultValue={
                                                        office?.phone ?? ''
                                                    }
                                                    placeholder="Contoh: 021-1234567"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Email"
                                                htmlFor="email"
                                                error={errors.email}
                                            >
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={
                                                        office?.email ?? ''
                                                    }
                                                    placeholder="kantor@perusahaan.com"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Link Google Maps"
                                                htmlFor="map_url"
                                                error={errors.map_url}
                                            >
                                                <Input
                                                    id="map_url"
                                                    name="map_url"
                                                    type="url"
                                                    defaultValue={
                                                        office?.map_url ?? ''
                                                    }
                                                    placeholder="https://maps.google.com/..."
                                                />
                                            </FormField>
                                        </div>
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
                                                office?.is_active ?? true
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
                                                    office?.sort_order ?? 0
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
