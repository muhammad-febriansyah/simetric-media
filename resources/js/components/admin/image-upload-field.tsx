import { ImageIcon, XIcon } from 'lucide-react';
import { useRef } from 'react';
import { CheckboxField } from '@/components/checkbox-field';
import { FormField } from '@/components/form-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatFileSize, useFilePreviews } from '@/hooks/use-file-previews';
import { cn } from '@/lib/utils';

type ImageUploadFieldProps = {
    /** Input name. For multiple uploads use e.g. "gallery_images[]". */
    name: string;
    label: string;
    description: string;
    accept: string;
    currentUrl?: string | null;
    error?: string;
    required?: boolean;
    multiple?: boolean;
    /** Show a "remove current file" checkbox submitting `remove_{name}`. */
    removable?: boolean;
    previewClassName?: string;
};

/**
 * Image upload with a live preview of the chosen file(s) before saving.
 * Single mode shows the new file (or the current one) in the preview box;
 * multiple mode shows a grid of the newly chosen images.
 */
export function ImageUploadField({
    name,
    label,
    description,
    accept,
    currentUrl,
    error,
    required = false,
    multiple = false,
    removable = true,
    previewClassName,
}: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { previews, handleChange, clear } = useFilePreviews();
    const id = name.replace(/\[\]$/, '');
    const selected = previews[0];
    const shownUrl = selected?.url ?? currentUrl ?? null;

    const resetSelection = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        clear();
    };

    const input = (
        <Input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            accept={accept}
            multiple={multiple}
            required={required}
            onChange={handleChange}
            placeholder={`Pilih ${label.toLowerCase()}`}
        />
    );

    if (multiple) {
        return (
            <div className="flex flex-col gap-3">
                <FormField
                    label={label}
                    htmlFor={id}
                    required={required}
                    description={description}
                    error={error}
                >
                    {input}
                </FormField>
                {previews.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-primary/40 bg-accent/40 p-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-accent-foreground">
                                {previews.length} gambar baru akan diunggah
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                onClick={resetSelection}
                            >
                                <XIcon data-icon="inline-start" />
                                Batal pilih
                            </Button>
                        </div>
                        <div
                            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                            data-testid={`${id}-previews`}
                        >
                            {previews.map((preview) => (
                                <figure
                                    key={preview.url}
                                    className="flex flex-col gap-1"
                                >
                                    <img
                                        src={preview.url}
                                        alt={`Pratinjau ${preview.name}`}
                                        className="aspect-video w-full rounded-lg bg-card object-cover"
                                    />
                                    <figcaption className="truncate text-xs text-muted-foreground">
                                        {preview.name} ·{' '}
                                        {formatFileSize(preview.size)}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div
                className={cn(
                    'relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted',
                    selected && 'border-primary/60',
                    previewClassName,
                )}
                data-testid={`${id}-preview`}
            >
                {shownUrl ? (
                    <img
                        src={shownUrl}
                        alt={selected ? `Pratinjau ${selected.name}` : label}
                        className="size-full object-contain p-1"
                    />
                ) : (
                    <ImageIcon className="size-6 text-muted-foreground" />
                )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <FormField
                    label={label}
                    htmlFor={id}
                    required={required}
                    description={description}
                    error={error}
                >
                    {input}
                </FormField>
                {selected && (
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">Baru dipilih</Badge>
                        <span className="truncate text-xs text-muted-foreground">
                            {selected.name} · {formatFileSize(selected.size)}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={resetSelection}
                        >
                            <XIcon data-icon="inline-start" />
                            Batal pilih
                        </Button>
                    </div>
                )}
                {removable && currentUrl && !selected && (
                    <CheckboxField
                        id={`remove_${id}`}
                        name={`remove_${id}`}
                        label={`Hapus ${label.toLowerCase()}`}
                    />
                )}
            </div>
        </div>
    );
}
