// Components
import { Form, Head } from '@inertiajs/react';
import { MailIcon } from 'lucide-react';
import { FormField } from '@/components/form-field';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            {status && (
                <p className="mb-4 text-center text-sm font-medium text-success">
                    {status}
                </p>
            )}

            <div className="flex flex-col gap-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
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
                                    autoComplete="off"
                                    autoFocus
                                    required
                                    placeholder="nama@perusahaan.com"
                                />
                            </FormField>

                            <Button
                                className="w-full"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? (
                                    <Spinner data-icon="inline-start" />
                                ) : (
                                    <MailIcon data-icon="inline-start" />
                                )}
                                Email password reset link
                            </Button>
                        </FieldGroup>
                    )}
                </Form>

                <div className="flex justify-center gap-1 text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink href={login()}>log in</TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
