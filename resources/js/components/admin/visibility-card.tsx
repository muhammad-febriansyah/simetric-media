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

type VisibilityCardProps = {
    isActive: boolean;
    sortOrder: number;
    error?: string;
};

/**
 * "Show on website" toggle and sort order for simple content (team, logos, testimonials...).
 */
export function VisibilityCard({
    isActive,
    sortOrder,
    error,
}: VisibilityCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tampilan</CardTitle>
                <CardDescription>
                    Atur apakah data ini tampil di website.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup className="gap-5">
                    <CheckboxField
                        id="is_active"
                        name="is_active"
                        label="Tampilkan di website"
                        defaultChecked={isActive}
                    />
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
                </FieldGroup>
            </CardContent>
        </Card>
    );
}
