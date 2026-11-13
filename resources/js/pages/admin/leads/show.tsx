import { Form, Head } from '@inertiajs/react';
import {
    MailIcon,
    MessageSquarePlusIcon,
    PhoneIcon,
    SaveIcon,
} from 'lucide-react';
import LeadNoteController from '@/actions/App/Http/Controllers/Admin/LeadNoteController';
import ConsultationRequestController from '@/actions/App/Http/Controllers/Admin/ConsultationRequestController';
import { LeadStatusBadge } from '@/components/admin/status-badges';
import { FormField } from '@/components/form-field';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import { FieldGroup } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { index, show } from '@/routes/admin/leads';
import type { Lead, LeadActivity, Option } from '@/types';

type Props = {
    lead: Lead;
    activities: LeadActivity[];
    statusOptions: Option[];
    assigneeOptions: Option[];
};

const NO_ASSIGNEE = 'none';

function DetailItem({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium">{value || '-'}</dd>
        </div>
    );
}

function describeActivity(activity: LeadActivity): string {
    if (activity.type.value === 'status_changed') {
        return `Status: ${activity.from_status?.label ?? '-'} → ${activity.to_status?.label ?? '-'}`;
    }

    if (activity.type.value === 'assigned') {
        return `PIC: ${activity.note}`;
    }

    return activity.type.label;
}

export default function LeadShow({
    lead,
    activities,
    statusOptions,
    assigneeOptions,
}: Props) {
    const pageHeader = {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Lead Konsultasi', href: index() },
            { title: lead.name, href: show(lead.id) },
        ],
        title: lead.name,
        description: `${lead.company_name} · masuk ${lead.created_at_label ?? '-'}`,
    };

    return (
        <>
            <Head title={`Lead ${lead.name}`} />

            <PageHeader {...pageHeader} />

            <div className="grid items-start gap-6 xl:grid-cols-3">
                <div className="flex flex-col gap-6 xl:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="flex flex-col gap-1.5">
                                <CardTitle>Kebutuhan klien</CardTitle>
                                <CardDescription>
                                    {lead.problem_area.label}
                                </CardDescription>
                            </div>
                            <LeadStatusBadge status={lead.status} />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                                {lead.problem_description}
                            </p>
                            <Separator />
                            <dl className="grid gap-4 sm:grid-cols-3">
                                <DetailItem
                                    label="Target waktu"
                                    value={lead.timeline?.label}
                                />
                                <DetailItem
                                    label="Kisaran budget"
                                    value={lead.budget_range?.label}
                                />
                                <DetailItem
                                    label="Halaman asal"
                                    value={lead.source_page}
                                />
                            </dl>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak & perusahaan</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <DetailItem label="Nama" value={lead.name} />
                                <DetailItem
                                    label="Jabatan"
                                    value={lead.job_title}
                                />
                                <DetailItem
                                    label="Perusahaan"
                                    value={lead.company_name}
                                />
                                <DetailItem
                                    label="Industri"
                                    value={lead.industry?.name}
                                />
                                <DetailItem
                                    label="Ukuran perusahaan"
                                    value={lead.company_size?.label}
                                />
                                <DetailItem
                                    label="UTM source"
                                    value={lead.utm.source}
                                />
                            </dl>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="secondary" size="sm" asChild>
                                    <a href={`mailto:${lead.email}`}>
                                        <MailIcon data-icon="inline-start" />
                                        {lead.email}
                                    </a>
                                </Button>
                                <Button variant="secondary" size="sm" asChild>
                                    <a
                                        href={`https://wa.me/${lead.phone.replace(/\D/g, '').replace(/^0/, '62')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <PhoneIcon data-icon="inline-start" />
                                        {lead.phone}
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat aktivitas</CardTitle>
                            <CardDescription>
                                Semua perubahan dan catatan follow-up.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {activities.length === 0 ? (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyTitle>
                                            Belum ada aktivitas
                                        </EmptyTitle>
                                        <EmptyDescription>
                                            Perubahan status dan catatan akan
                                            tampil di sini.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <ol className="flex flex-col">
                                    {activities.map((activity, position) => (
                                        <li
                                            key={activity.id}
                                            className="relative flex gap-4 pb-6 last:pb-0"
                                        >
                                            {position <
                                                activities.length - 1 && (
                                                <span className="absolute top-3 left-[5px] h-full w-px bg-border" />
                                            )}
                                            <span className="relative mt-1.5 size-3 shrink-0 rounded-full bg-primary" />
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium">
                                                    {describeActivity(activity)}
                                                </span>
                                                {activity.type.value ===
                                                    'note' && (
                                                    <p className="text-sm whitespace-pre-line text-muted-foreground">
                                                        {activity.note}
                                                    </p>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    {activity.user?.name ??
                                                        'Sistem'}{' '}
                                                    ·{' '}
                                                    {activity.created_at_label}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status & PIC</CardTitle>
                            <CardDescription>
                                Perubahan otomatis tercatat di riwayat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...ConsultationRequestController.update.form(
                                    lead.id,
                                )}
                                options={{ preserveScroll: true }}
                                transform={(data) => ({
                                    ...data,
                                    assigned_to:
                                        data.assigned_to === NO_ASSIGNEE
                                            ? null
                                            : data.assigned_to,
                                })}
                            >
                                {({ errors, processing }) => (
                                    <FieldGroup className="gap-5">
                                        <FormField
                                            label="Status"
                                            htmlFor="status"
                                            required
                                            error={errors.status}
                                        >
                                            <Select
                                                name="status"
                                                defaultValue={lead.status.value}
                                            >
                                                <SelectTrigger
                                                    id="status"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {statusOptions.map(
                                                            (option) => (
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
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField
                                            label="PIC"
                                            htmlFor="assigned_to"
                                            error={errors.assigned_to}
                                        >
                                            <Select
                                                name="assigned_to"
                                                defaultValue={
                                                    lead.assignee
                                                        ? String(
                                                              lead.assignee.id,
                                                          )
                                                        : NO_ASSIGNEE
                                                }
                                            >
                                                <SelectTrigger
                                                    id="assigned_to"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Pilih PIC" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem
                                                            value={NO_ASSIGNEE}
                                                        >
                                                            Tanpa PIC
                                                        </SelectItem>
                                                        {assigneeOptions.map(
                                                            (option) => (
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
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <Spinner data-icon="inline-start" />
                                            ) : (
                                                <SaveIcon data-icon="inline-start" />
                                            )}
                                            Simpan perubahan
                                        </Button>
                                    </FieldGroup>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah catatan</CardTitle>
                            <CardDescription>
                                Hasil telepon, meeting, atau tindak lanjut.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...LeadNoteController.store.form(lead.id)}
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                            >
                                {({ errors, processing }) => (
                                    <FieldGroup className="gap-5">
                                        <FormField
                                            label="Catatan"
                                            htmlFor="note"
                                            required
                                            error={errors.note}
                                        >
                                            <Textarea
                                                id="note"
                                                name="note"
                                                required
                                                placeholder="Contoh: Sudah discovery call, klien minta proposal minggu depan."
                                            />
                                        </FormField>
                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <Spinner data-icon="inline-start" />
                                            ) : (
                                                <MessageSquarePlusIcon data-icon="inline-start" />
                                            )}
                                            Tambah catatan
                                        </Button>
                                    </FieldGroup>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
