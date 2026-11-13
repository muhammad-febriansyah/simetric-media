import { Form, Head } from '@inertiajs/react';
import FaqController from '@/actions/App/Http/Controllers/Admin/FaqController';
import { FormActions } from '@/components/admin/form-actions';
import { VisibilityCard } from '@/components/admin/visibility-card';
import { FormField } from '@/components/form-field';
import { PageHeader } from '@/components/page-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/faqs';
import type { Faq, OptionGroup } from '@/types';

type Props = {
    faq: Faq | null;
    placementGroups: OptionGroup[];
};

export default function FaqForm({ faq, placementGroups }: Props) {
    const title = faq ? 'Edit FAQ' : 'Tambah FAQ';
    const formAction = faq
        ? FaqController.update.form(faq.id)
        : FaqController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'FAQ', href: index() },
                    {
                        title: faq ? faq.question : 'Tambah',
                        href: faq ? edit(faq.id) : create(),
                    },
                ]}
                title={title}
                description="Jawab keraguan calon klien sebelum mereka bertanya."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Pertanyaan & jawaban</CardTitle>
                                    <CardDescription>
                                        Pilih di halaman mana FAQ ini tampil.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <FormField
                                            label="Lokasi tampil"
                                            htmlFor="placement"
                                            required
                                            error={errors.placement}
                                        >
                                            <Select
                                                name="placement"
                                                defaultValue={faq?.placement}
                                            >
                                                <SelectTrigger
                                                    id="placement"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Pilih halaman atau konten" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {placementGroups
                                                        .filter(
                                                            (group) =>
                                                                group.options
                                                                    .length > 0,
                                                        )
                                                        .map((group) => (
                                                            <SelectGroup
                                                                key={
                                                                    group.label
                                                                }
                                                            >
                                                                <SelectLabel>
                                                                    {
                                                                        group.label
                                                                    }
                                                                </SelectLabel>
                                                                {group.options.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={
                                                                                option.value
                                                                            }
                                                                        >
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectGroup>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField
                                            label="Pertanyaan"
                                            htmlFor="question"
                                            required
                                            error={errors.question}
                                        >
                                            <Input
                                                id="question"
                                                name="question"
                                                required
                                                defaultValue={faq?.question}
                                                placeholder="Contoh: Apakah konsultasi awal benar-benar gratis?"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Jawaban"
                                            htmlFor="answer"
                                            required
                                            error={errors.answer}
                                        >
                                            <Textarea
                                                id="answer"
                                                name="answer"
                                                required
                                                rows={6}
                                                defaultValue={faq?.answer}
                                                placeholder="Jawab singkat dan jelas, tanpa istilah teknis."
                                            />
                                        </FormField>
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            <VisibilityCard
                                isActive={faq?.is_active ?? true}
                                sortOrder={faq?.sort_order ?? 0}
                                error={errors.sort_order}
                            />
                        </div>

                        <FormActions
                            cancelHref={index()}
                            processing={processing}
                        />
                    </>
                )}
            </Form>
        </>
    );
}
