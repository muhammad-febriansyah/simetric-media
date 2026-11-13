import { Form } from '@inertiajs/react';
import { Trash2Icon, TriangleAlertIcon, XIcon } from 'lucide-react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FormField } from '@/components/form-field';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <Card>
            <CardContent className="flex flex-col gap-6">
                <Heading
                    variant="small"
                    title="Delete account"
                    description="Delete your account and all of its resources"
                />
                <div className="flex flex-col items-start gap-4">
                    <Alert variant="destructive">
                        <TriangleAlertIcon />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            Please proceed with caution, this cannot be undone.
                        </AlertDescription>
                    </Alert>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                data-test="delete-user-button"
                            >
                                <Trash2Icon data-icon="inline-start" />
                                Hapus akun
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>
                                Are you sure you want to delete your account?
                            </DialogTitle>
                            <DialogDescription>
                                Once your account is deleted, all of its
                                resources and data will also be permanently
                                deleted. Please enter your password to confirm
                                you would like to permanently delete your
                                account.
                            </DialogDescription>

                            <Form
                                {...ProfileController.destroy.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                onError={() => passwordInput.current?.focus()}
                                resetOnSuccess
                                className="flex flex-col gap-6"
                            >
                                {({
                                    resetAndClearErrors,
                                    processing,
                                    errors,
                                }) => (
                                    <>
                                        <FormField
                                            label="Password"
                                            htmlFor="password"
                                            required
                                            error={errors.password}
                                        >
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                ref={passwordInput}
                                                required
                                                placeholder="Masukkan password untuk konfirmasi"
                                                autoComplete="current-password"
                                            />
                                        </FormField>

                                        <DialogFooter className="gap-2">
                                            <DialogClose asChild>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        resetAndClearErrors()
                                                    }
                                                >
                                                    <XIcon data-icon="inline-start" />
                                                    Batal
                                                </Button>
                                            </DialogClose>

                                            <Button
                                                variant="destructive"
                                                disabled={processing}
                                                asChild
                                            >
                                                <button
                                                    type="submit"
                                                    data-test="confirm-delete-user-button"
                                                >
                                                    {processing ? (
                                                        <Spinner data-icon="inline-start" />
                                                    ) : (
                                                        <Trash2Icon data-icon="inline-start" />
                                                    )}
                                                    Hapus akun
                                                </button>
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
