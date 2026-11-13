import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

/**
 * Square brand mark: the uploaded logo from website settings, or the default icon.
 */
export function BrandMark({ className }: { className?: string }) {
    const { name, site } = usePage().props;

    if (site.site_logo_url) {
        return (
            <img
                src={site.site_logo_url}
                alt={name}
                className={cn(
                    'size-9 shrink-0 rounded-xl object-contain',
                    className,
                )}
            />
        );
    }

    return (
        <span
            className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary',
                className,
            )}
        >
            <AppLogoIcon className="size-1/2 fill-current text-primary-foreground" />
        </span>
    );
}
