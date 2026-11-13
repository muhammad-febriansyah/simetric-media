import type { InertiaLinkProps } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { InfoIcon, SaveIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

type FormActionsProps = {
    cancelHref: NonNullable<InertiaLinkProps['href']>;
    processing: boolean;
    submitLabel?: string;
};

/**
 * Compact sticky action bar for admin forms: a required-field hint on the
 * left, Cancel and Save on the right.
 */
export function FormActions({
    cancelHref,
    processing,
    submitLabel = 'Simpan',
}: FormActionsProps) {
    return (
        <Card className="sticky bottom-4 z-10 border border-border py-3 shadow-[0_8px_30px_-12px_rgb(37_71_249_/_0.25)]">
            <CardContent className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <InfoIcon className="size-4 shrink-0 text-primary" />
                    <span>
                        Kolom bertanda{' '}
                        <span className="font-semibold text-destructive">
                            *
                        </span>{' '}
                        wajib diisi.
                    </span>
                </p>
                <div className="flex gap-2 sm:justify-end">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 sm:flex-none"
                        asChild
                    >
                        <Link href={cancelHref}>
                            <XIcon data-icon="inline-start" />
                            Batal
                        </Link>
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        className="flex-1 px-5 sm:flex-none"
                        disabled={processing}
                    >
                        {processing ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <SaveIcon data-icon="inline-start" />
                        )}
                        {processing ? 'Menyimpan...' : submitLabel}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
