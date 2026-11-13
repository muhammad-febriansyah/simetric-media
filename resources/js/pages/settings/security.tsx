import { Form, Head } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import { FormField } from '@/components/form-field';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { edit } from '@/routes/security';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';

// oxfmt-ignore
type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Security settings" />

            <Card>
                <CardHeader>
                    <CardTitle>Update password</CardTitle>
                    <CardDescription>
                        Ensure your account is using a long, random password to
                        stay secure
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        {...SecurityController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                    >
                        {({ errors, processing }) => (
                            <FieldGroup className="gap-5">
                                <FormField
                                    label="Current password"
                                    htmlFor="current_password"
                                    required
                                    error={errors.current_password}
                                >
                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        required
                                        autoComplete="current-password"
                                        placeholder="Masukkan password saat ini"
                                    />
                                </FormField>

                                <FormField
                                    label="New password"
                                    htmlFor="password"
                                    required
                                    error={errors.password}
                                >
                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Minimal 8 karakter"
                                        passwordrules={props.passwordRules}
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
                                        required
                                        autoComplete="new-password"
                                        placeholder="Ulangi password baru"
                                        passwordrules={props.passwordRules}
                                    />
                                </FormField>

                                <div>
                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
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

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
    title: 'Security settings',
    description:
        'Manage your password, two-factor authentication and passkeys.',
};
