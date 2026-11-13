import type { ReactNode } from 'react';
import { CheckboxField } from '@/components/checkbox-field';
import { FormField } from '@/components/form-field';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type PublicationCardProps = {
    isPublished: boolean;
    sortOrder: number;
    error?: string;
    /** Hide the sort order field for content ordered by date (e.g. articles). */
    hideSortOrder?: boolean;
    children?: ReactNode;
};

/**
 * Publish toggle and sort order shared by admin content forms.
 */
export function PublicationCard({
    isPublished,
    sortOrder,
    error,
    hideSortOrder = false,
    children,
}: PublicationCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Publikasi</CardTitle>
                <CardDescription>
                    Hanya konten yang terbit tampil di website.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup className="gap-5">
                    <CheckboxField
                        id="is_published"
                        name="is_published"
                        label="Terbitkan di website"
                        defaultChecked={isPublished}
                    />
                    {children}
                    {!hideSortOrder && (
                        <FormField
                            label="Urutan tampil"
                            htmlFor="sort_order"
                            description="Angka kecil tampil lebih dulu."
                            error={error}
                        >
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                min={0}
                                defaultValue={sortOrder}
                                placeholder="0"
                            />
                        </FormField>
                    )}
                </FieldGroup>
            </CardContent>
        </Card>
    );
}
