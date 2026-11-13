import { Form, Head } from '@inertiajs/react';
import { LockKeyholeIcon } from 'lucide-react';
import { FormField } from '@/components/form-field';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import PasskeyVerify from '@/components/passkey-verify';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Confirm with passkey"
                loadingLabel="Confirming..."
                separator="Or confirm with password"
            />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <FieldGroup className="gap-5">
                        <FormField
                            label="Password"
                            htmlFor="password"
                            required
                            error={errors.password}
                        >
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                required
                                autoFocus
                            />
                        </FormField>

                        <Button
                            className="w-full"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing ? (
                                <Spinner data-icon="inline-start" />
                            ) : (
                                <LockKeyholeIcon data-icon="inline-start" />
                            )}
                            Confirm password
                        </Button>
                    </FieldGroup>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
