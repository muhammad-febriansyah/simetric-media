import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

type SeoCardProps = {
    metaTitle: string | null | undefined;
    metaDescription: string | null | undefined;
    errors: Record<string, string | undefined>;
};

const TITLE_LIMIT = 70;
const DESCRIPTION_LIMIT = 160;

/**
 * Meta title and description fields with live character counters.
 */
export function SeoCard({ metaTitle, metaDescription, errors }: SeoCardProps) {
    const [titleLength, setTitleLength] = useState(metaTitle?.length ?? 0);
    const [descriptionLength, setDescriptionLength] = useState(
        metaDescription?.length ?? 0,
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>
                    Tampil di hasil pencarian Google. Kosongkan untuk memakai
                    judul dan ringkasan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup className="gap-5">
                    <FormField
                        label="Meta title"
                        htmlFor="meta_title"
                        description={`${titleLength}/${TITLE_LIMIT} karakter`}
                        error={errors.meta_title}
                    >
                        <Input
                            id="meta_title"
                            name="meta_title"
                            maxLength={TITLE_LIMIT}
                            defaultValue={metaTitle ?? ''}
                            onChange={(event) =>
                                setTitleLength(event.target.value.length)
                            }
                            placeholder="Contoh: Konsultan Digitalisasi Pabrik"
                        />
                    </FormField>
                    <FormField
                        label="Meta description"
                        htmlFor="meta_description"
                        description={`${descriptionLength}/${DESCRIPTION_LIMIT} karakter`}
                        error={errors.meta_description}
                    >
                        <Textarea
                            id="meta_description"
                            name="meta_description"
                            maxLength={DESCRIPTION_LIMIT}
                            defaultValue={metaDescription ?? ''}
                            onChange={(event) =>
                                setDescriptionLength(event.target.value.length)
                            }
                            placeholder="Ringkasan singkat yang membuat orang ingin klik."
                        />
                    </FormField>
                </FieldGroup>
            </CardContent>
        </Card>
    );
}
