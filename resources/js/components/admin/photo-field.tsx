import { ImageUploadField } from '@/components/admin/image-upload-field';

type PhotoFieldProps = {
    currentUrl: string | null | undefined;
    alt: string;
    error?: string;
};

/**
 * Optional profile photo upload with a live round preview and a remove option.
 * Submits `photo` and `remove_photo`.
 */
export function PhotoField({ currentUrl, error }: PhotoFieldProps) {
    return (
        <ImageUploadField
            name="photo"
            label="Foto"
            description="JPG, PNG, atau WEBP persegi, maksimal 2 MB."
            accept="image/jpeg,image/png,image/webp"
            currentUrl={currentUrl}
            error={error}
            previewClassName="rounded-full [&_img]:object-cover [&_img]:p-0"
        />
    );
}
