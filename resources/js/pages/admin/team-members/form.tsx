import { Form, Head } from '@inertiajs/react';
import TeamMemberController from '@/actions/App/Http/Controllers/Admin/TeamMemberController';
import { FormActions } from '@/components/admin/form-actions';
import { PhotoField } from '@/components/admin/photo-field';
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
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/team-members';
import type { TeamMember } from '@/types';

export default function TeamMemberForm({
    teamMember,
}: {
    teamMember: TeamMember | null;
}) {
    const title = teamMember ? 'Edit Anggota Tim' : 'Tambah Anggota Tim';
    const formAction = teamMember
        ? TeamMemberController.update.form(teamMember.id)
        : TeamMemberController.store.form();

    return (
        <>
            <Head title={title} />

            <PageHeader
                breadcrumbs={[
                    { title: 'Dashboard', href: dashboard() },
                    { title: 'Tim', href: index() },
                    {
                        title: teamMember ? teamMember.name : 'Tambah',
                        href: teamMember ? edit(teamMember.id) : create(),
                    },
                ]}
                title={title}
                description="Tampil di halaman Tentang untuk membangun kepercayaan calon klien."
            />

            <Form {...formAction} className="flex flex-col gap-6">
                {({ errors, processing }) => (
                    <>
                        <div className="grid items-start gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader>
                                    <CardTitle>Profil</CardTitle>
                                    <CardDescription>
                                        Nama, jabatan, dan pengalaman singkat.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup className="gap-5">
                                        <PhotoField
                                            currentUrl={teamMember?.photo_url}
                                            alt={teamMember?.name ?? 'Foto'}
                                            error={errors.photo}
                                        />
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <FormField
                                                label="Nama"
                                                htmlFor="name"
                                                required
                                                error={errors.name}
                                            >
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    defaultValue={
                                                        teamMember?.name
                                                    }
                                                    placeholder="Contoh: Andi Pratama"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Jabatan"
                                                htmlFor="position"
                                                required
                                                error={errors.position}
                                            >
                                                <Input
                                                    id="position"
                                                    name="position"
                                                    required
                                                    defaultValue={
                                                        teamMember?.position
                                                    }
                                                    placeholder="Contoh: Lead Consultant"
                                                />
                                            </FormField>
                                        </div>
                                        <FormField
                                            label="Bio singkat"
                                            htmlFor="bio"
                                            error={errors.bio}
                                        >
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                defaultValue={
                                                    teamMember?.bio ?? ''
                                                }
                                                placeholder="Contoh: 10 tahun mendampingi digitalisasi pabrik dan distribusi."
                                            />
                                        </FormField>
                                        <FormField
                                            label="Link LinkedIn"
                                            htmlFor="linkedin_url"
                                            error={errors.linkedin_url}
                                        >
                                            <Input
                                                id="linkedin_url"
                                                name="linkedin_url"
                                                type="url"
                                                defaultValue={
                                                    teamMember?.linkedin_url ??
                                                    ''
                                                }
                                                placeholder="https://www.linkedin.com/in/nama"
                                            />
                                        </FormField>
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            <VisibilityCard
                                isActive={teamMember?.is_active ?? true}
                                sortOrder={teamMember?.sort_order ?? 0}
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
