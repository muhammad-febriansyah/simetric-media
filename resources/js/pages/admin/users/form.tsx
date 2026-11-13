import { Form, Head } from '@inertiajs/react';
import { InfoIcon } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { FormActions } from '@/components/admin/form-actions';
import { CheckboxField } from '@/components/checkbox-field';
import { FormField } from '@/components/form-field';
import { PageHeader } from '@/components/page-header';
import PasswordInput from '@/components/password-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/users';
import type { AdminUser } from '@/types';

export default function UserForm({ user }: { user: AdminUser | null }) {
    const title = user ? 'Edit Pengguna' : 'Tambah Pengguna';
    const formAction = user
        ? UserController.update.form(user.id)
        : UserController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Pengguna', href: index() },
                    {
                        title: user ? user.name : 'Tambah',
                        href: user ? edit(user.id) : create(),
                    },
                ]}
                title={title}
                description="Akun untuk rekan tim yang mengelola website dan menindaklanjuti lead."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Data akun</CardTitle>
                                    <CardDescription>
                                        Email dipakai untuk login.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label="Nama"
                                                htmlFor="name"
                                                required
                                                error={errors.name}
                                            >
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    defaultValue={user?.name}
                                                    autoComplete="off"
                                                    placeholder="Contoh: Rina Wijaya"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Email"
                                                htmlFor="email"
                                                required
                                                error={errors.email}
                                            >
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    defaultValue={user?.email}
                                                    autoComplete="off"
                                                    placeholder="nama@perusahaan.com"
                                                />
                                            </FormField>
                                        </div>
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label={
                                                    user
                                                        ? 'Password baru'
                                                        : 'Password'
                                                }
                                                htmlFor="password"
                                                required={!user}
                                                description={
                                                    user
                                                        ? 'Kosongkan jika tidak ingin mengganti password.'
                                                        : undefined
                                                }
                                                error={errors.password}
                                            >
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required={!user}
                                                    autoComplete="new-password"
                                                    placeholder="Minimal 8 karakter"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Konfirmasi password"
                                                htmlFor="password_confirmation"
                                                required={!user}
                                            >
                                                <PasswordInput
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    required={!user}
                                                    autoComplete="new-password"
                                                    placeholder="Ulangi password"
                                                />
                                            </FormField>
                                        </div>
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Akses</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-5">
                                    <CheckboxField
                                        id="is_admin"
                                        name="is_admin"
                                        label="Akses panel admin"
                                        description="Bisa masuk ke panel, mengelola konten, dan menjadi PIC lead."
                                        defaultChecked={user?.is_admin ?? true}
                                    />
                                    {errors.is_admin && (
                                        <FieldError>
                                            {errors.is_admin}
                                        </FieldError>
                                    )}
                                    {!user && (
                                        <Alert>
                                            <InfoIcon />
                                            <AlertTitle>Info</AlertTitle>
                                            <AlertDescription>
                                                Kirimkan email dan password
                                                kepada rekan Anda, lalu minta
                                                mereka menggantinya setelah
                                                login.
                                            </AlertDescription>
                                        </Alert>
                                    )}
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
