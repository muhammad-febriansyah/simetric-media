import { Link, usePage } from '@inertiajs/react';
import { BrandMark } from '@/components/brand-mark';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { site } = usePage().props;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                {site.site_logo_url && (
                    <Link
                        href={home()}
                        className="flex items-center justify-center"
                    >
                        <BrandMark className="size-12 rounded-2xl" />
                        <span className="sr-only">Beranda</span>
                    </Link>
                )}

                <Card className="gap-6 py-8">
                    <CardHeader className="items-center gap-2 px-6 text-center md:px-8">
                        <CardTitle className="text-xl">{title}</CardTitle>
                        {description && (
                            <CardDescription>{description}</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="px-6 md:px-8">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
