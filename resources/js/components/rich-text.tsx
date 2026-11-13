import { cn } from '@/lib/utils';

/**
 * Render HTML written in the admin rich text editor. The HTML is sanitized on the
 * server (App\Support\RichText) before it is saved, so it is safe to inject here.
 */
export function RichText({
    html,
    className,
}: {
    html: string;
    className?: string;
}) {
    return (
        <div
            className={cn('rich-text', className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
