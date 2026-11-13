import { Form, Head } from '@inertiajs/react';
import { KeyRoundIcon } from 'lucide-react';
import { FormField } from '@/components/form-field';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <FieldGroup className="gap-5">
                        <FormField
                            label="Email"
                            htmlFor="email"
                            error={errors.email}
                        >
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                placeholder="nama@perusahaan.com"
                                readOnly
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
                                autoComplete="new-password"
                                autoFocus
                                required
                                placeholder="Minimal 8 karakter"
                                passwordrules={passwordRules}
                            />
                        </FormField>

                        <FormField
                            label="Confirm password"
                            htmlFor="password_confirmation"
                            required
                            error={errors.password_confirmation}
                        >
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                required
                                placeholder="Ulangi password"
                                passwordrules={passwordRules}
                            />
                        </FormField>

                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? (
                                <Spinner data-icon="inline-start" />
                            ) : (
                                <KeyRoundIcon data-icon="inline-start" />
                            )}
                            Reset password
                        </Button>
                    </FieldGroup>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};
