import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

export type FilePreview = {
    url: string;
    name: string;
    size: number;
};

/**
 * Turns the files chosen in a file input into temporary object URLs for
 * previewing images before upload. URLs are revoked when replaced or unmounted.
 */
export function useFilePreviews() {
    const [previews, setPreviews] = useState<FilePreview[]>([]);

    useEffect(() => {
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []).filter(
            (file) =>
                file.type.startsWith('image/') ||
                /\.(ico|svg)$/i.test(file.name),
        );

        setPreviews(
            files.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
            })),
        );
    };

    const clear = () => setPreviews([]);

    return { previews, handleChange, clear };
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
