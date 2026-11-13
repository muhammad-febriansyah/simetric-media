import { Form, Head } from '@inertiajs/react';
import { LogInIcon } from 'lucide-react';
import { FormField } from '@/components/form-field';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <FieldGroup className="gap-5">
                            <FormField
                                label="Email address"
                                htmlFor="email"
                                required
                                error={errors.email}
                            >
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nama@perusahaan.com"
                                />
                            </FormField>

                            <FormField
                                label="Password"
                                htmlFor="password"
                                required
                                error={errors.password}
                            >
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan password"
                                />
                            </FormField>

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember">
                                        Remember me
                                    </Label>
                                </div>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-sm"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner data-icon="inline-start" />
                                ) : (
                                    <LogInIcon data-icon="inline-start" />
                                )}
                                Log in
                            </Button>
                        </FieldGroup>
                    </>
                )}
            </Form>

            <PasskeyVerify placement="after" separator="atau" />

            {status && (
                <p className="mt-4 text-center text-sm font-medium text-success">
                    {status}
                </p>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
