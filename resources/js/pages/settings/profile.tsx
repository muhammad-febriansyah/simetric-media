import { Form, Head, Link, usePage } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Update your name and email address
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                    >
                        {({ processing, errors }) => (
                            <FieldGroup className="gap-5">
                                <FormField
                                    label="Name"
                                    htmlFor="name"
                                    required
                                    error={errors.name}
                                >
                                    <Input
                                        id="name"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                </FormField>

                                <FormField
                                    label="Email address"
                                    htmlFor="email"
                                    required
                                    error={errors.email}
                                >
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="nama@perusahaan.com"
                                    />
                                </FormField>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="cursor-pointer text-primary underline decoration-primary/30 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!"
                                                >
                                                    Click here to re-send the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <p className="text-sm font-medium text-success">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                <div>
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        {processing ? (
                                            <Spinner data-icon="inline-start" />
                                        ) : (
                                            <SaveIcon data-icon="inline-start" />
                                        )}
                                        Simpan
                                    </Button>
                                </div>
                            </FieldGroup>
                        )}
                    </Form>
                </CardContent>
            </Card>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
    title: 'Profile settings',
    description: 'Manage your profile information and account.',
};
