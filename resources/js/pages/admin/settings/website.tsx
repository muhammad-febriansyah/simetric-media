import { Form, Head } from '@inertiajs/react';
import {
    GlobeIcon,
    LayoutTemplateIcon,
    MapPinIcon,
    SaveIcon,
    SearchIcon,
    Share2Icon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import SiteSettingController from '@/actions/App/Http/Controllers/Admin/SiteSettingController';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { edit } from '@/routes/admin/site-settings';
import type { SiteSettings } from '@/types';

type TabKey = 'general' | 'contact' | 'social' | 'seo' | 'pages';

const TABS: {
    key: TabKey;
    label: string;
    icon: LucideIcon;
    fields: string[];
}[] = [
    {
        key: 'general',
        label: 'Umum',
        icon: GlobeIcon,
        fields: [
            'site_name',
            'tagline',
            'footer_text',
            'site_logo',
            'site_favicon',
        ],
    },
    {
        key: 'contact',
        label: 'Kontak & Lokasi',
        icon: MapPinIcon,
        fields: [
            'contact_email',
            'contact_phone',
            'contact_whatsapp',
            'contact_address',
            'business_hours',
            'maps_embed_url',
        ],
    },
    {
        key: 'social',
        label: 'Media Sosial',
        icon: Share2Icon,
        fields: [
            'social_linkedin',
            'social_instagram',
            'social_youtube',
            'social_facebook',
            'social_x',
            'social_tiktok',
        ],
    },
    {
        key: 'seo',
        label: 'SEO',
        icon: SearchIcon,
        fields: [
            'seo_title',
            'seo_description',
            'seo_keywords',
            'seo_og_image',
            'google_analytics_id',
            'google_site_verification',
        ],
    },
    {
        key: 'pages',
        label: 'Halaman',
        icon: LayoutTemplateIcon,
        fields: ['expertise_page_title', 'expertise_page_description'],
    },
];

const SOCIAL_FIELDS: {
    name: keyof SiteSettings;
    label: string;
    placeholder: string;
}[] = [
    {
        name: 'social_linkedin',
        label: 'LinkedIn',
        placeholder: 'https://www.linkedin.com/company/nama',
    },
    {
        name: 'social_instagram',
        label: 'Instagram',
        placeholder: 'https://www.instagram.com/nama',
    },
    {
        name: 'social_youtube',
        label: 'YouTube',
        placeholder: 'https://www.youtube.com/@nama',
    },
    {
        name: 'social_facebook',
        label: 'Facebook',
        placeholder: 'https://www.facebook.com/nama',
    },
    {
        name: 'social_x',
        label: 'X (Twitter)',
        placeholder: 'https://x.com/nama',
    },
    {
        name: 'social_tiktok',
        label: 'TikTok',
        placeholder: 'https://www.tiktok.com/@nama',
    },
];

function tabWithError(
    errors: Record<string, string | undefined>,
): TabKey | null {
    return (
        TABS.find((tab) => tab.fields.some((field) => errors[field]))?.key ??
        null
    );
}

export default function WebsiteSettings({
    settings,
}: {
    settings: SiteSettings;
}) {
    const [activeTab, setActiveTab] = useState<TabKey>('general');
    const [mapsPreview, setMapsPreview] = useState(
        settings.maps_embed_url ?? '',
    );

    return (
        <>
            <Head title="Pengaturan Website" />

            <Form
                {...SiteSettingController.update.form()}
                options={{ preserveScroll: true }}
                onError={(errors) => {
                    const tab = tabWithError(errors);

                    if (tab) {
                        setActiveTab(tab);
                    }
                }}
                className="flex flex-col gap-6"
            >
                {({ errors, processing }) => (
                    <>
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) =>
                                setActiveTab(value as TabKey)
                            }
                            className="flex flex-col gap-6"
                        >
                            <div className="overflow-x-auto">
                                <TabsList className="bg-card">
                                    {TABS.map((tab) => (
                                        <TabsTrigger
                                            key={tab.key}
                                            value={tab.key}
                                        >
                                            <tab.icon />
                                            {tab.label}
                                            {tab.fields.some(
                                                (field) => errors[field],
                                            ) && (
                                                <span className="size-2 rounded-full bg-destructive" />
                                            )}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            <TabsContent
                                value="general"
                                forceMount
                                className="data-[state=inactive]:hidden"
                            >
                                <div className="grid items-start gap-6 xl:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Identitas website
                                            </CardTitle>
                                            <CardDescription>
                                                Nama tampil di tab browser,
                                                header, footer, dan email.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldGroup className="gap-5">
                                                <FormField
                                                    label="Nama website"
                                                    htmlFor="site_name"
                                                    required
                                                    error={errors.site_name}
                                                >
                                                    <Input
                                                        id="site_name"
                                                        name="site_name"
                                                        required
                                                        maxLength={60}
                                                        defaultValue={
                                                            settings.site_name ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: Simetric Media"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Tagline"
                                                    htmlFor="tagline"
                                                    required
                                                    error={errors.tagline}
                                                >
                                                    <Textarea
                                                        id="tagline"
                                                        name="tagline"
                                                        required
                                                        defaultValue={
                                                            settings.tagline ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: Konsultan teknologi yang mendampingi bisnis Anda dari A sampai Z."
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Teks footer"
                                                    htmlFor="footer_text"
                                                    description="Kosongkan untuk memakai © tahun + nama website."
                                                    error={errors.footer_text}
                                                >
                                                    <Input
                                                        id="footer_text"
                                                        name="footer_text"
                                                        defaultValue={
                                                            settings.footer_text ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: © 2026 PT Simetric Media. Semua hak dilindungi."
                                                    />
                                                </FormField>
                                            </FieldGroup>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Logo & favicon
                                            </CardTitle>
                                            <CardDescription>
                                                Logo tampil di header website,
                                                panel admin, dan halaman login.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldGroup className="gap-6">
                                                <ImageUploadField
                                                    name="site_logo"
                                                    label="Logo"
                                                    description="Persegi, latar transparan. PNG, SVG, JPG, atau WEBP, maksimal 1 MB."
                                                    accept="image/png,image/svg+xml,image/jpeg,image/webp"
                                                    currentUrl={
                                                        settings.site_logo_url
                                                    }
                                                    error={errors.site_logo}
                                                />
                                                <ImageUploadField
                                                    name="site_favicon"
                                                    label="Favicon"
                                                    description="Ikon kecil di tab browser. PNG, ICO, atau SVG 512×512, maksimal 512 KB."
                                                    accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
                                                    currentUrl={
                                                        settings.site_favicon_url
                                                    }
                                                    error={errors.site_favicon}
                                                    previewClassName="size-14"
                                                />
                                            </FieldGroup>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="contact"
                                forceMount
                                className="data-[state=inactive]:hidden"
                            >
                                <div className="grid items-start gap-6 xl:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Kontak</CardTitle>
                                            <CardDescription>
                                                Tampil di footer dan halaman
                                                Konsultasi. Alamat lengkap tiap
                                                kantor diatur di menu Kantor.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldGroup className="gap-5">
                                                <div className="grid gap-5 md:grid-cols-2">
                                                    <FormField
                                                        label="Email kontak"
                                                        htmlFor="contact_email"
                                                        required
                                                        error={
                                                            errors.contact_email
                                                        }
                                                    >
                                                        <Input
                                                            id="contact_email"
                                                            name="contact_email"
                                                            type="email"
                                                            required
                                                            defaultValue={
                                                                settings.contact_email ??
                                                                ''
                                                            }
                                                            placeholder="halo@perusahaan.com"
                                                        />
                                                    </FormField>
                                                    <FormField
                                                        label="Telepon"
                                                        htmlFor="contact_phone"
                                                        required
                                                        error={
                                                            errors.contact_phone
                                                        }
                                                    >
                                                        <Input
                                                            id="contact_phone"
                                                            name="contact_phone"
                                                            required
                                                            defaultValue={
                                                                settings.contact_phone ??
                                                                ''
                                                            }
                                                            placeholder="+62 21 1234 5678"
                                                        />
                                                    </FormField>
                                                    <FormField
                                                        label="Nomor WhatsApp"
                                                        htmlFor="contact_whatsapp"
                                                        required
                                                        description="Diawali 62, tanpa spasi atau tanda +."
                                                        error={
                                                            errors.contact_whatsapp
                                                        }
                                                    >
                                                        <Input
                                                            id="contact_whatsapp"
                                                            name="contact_whatsapp"
                                                            required
                                                            inputMode="numeric"
                                                            defaultValue={
                                                                settings.contact_whatsapp ??
                                                                ''
                                                            }
                                                            placeholder="6281234567890"
                                                        />
                                                    </FormField>
                                                    <FormField
                                                        label="Alamat singkat"
                                                        htmlFor="contact_address"
                                                        required
                                                        error={
                                                            errors.contact_address
                                                        }
                                                    >
                                                        <Input
                                                            id="contact_address"
                                                            name="contact_address"
                                                            required
                                                            defaultValue={
                                                                settings.contact_address ??
                                                                ''
                                                            }
                                                            placeholder="Jakarta, Indonesia"
                                                        />
                                                    </FormField>
                                                </div>
                                                <FormField
                                                    label="Jam operasional"
                                                    htmlFor="business_hours"
                                                    error={
                                                        errors.business_hours
                                                    }
                                                >
                                                    <Input
                                                        id="business_hours"
                                                        name="business_hours"
                                                        defaultValue={
                                                            settings.business_hours ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: Senin–Jumat, 09.00–17.00 WIB"
                                                    />
                                                </FormField>
                                            </FieldGroup>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Google Maps</CardTitle>
                                            <CardDescription>
                                                Di Google Maps, buka lokasi
                                                kantor → Bagikan → Sematkan
                                                peta, lalu salin kodenya ke
                                                sini.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldGroup className="gap-5">
                                                <FormField
                                                    label="Kode atau link embed"
                                                    htmlFor="maps_embed_url"
                                                    description="Boleh tempel seluruh kode <iframe>, link-nya diambil otomatis."
                                                    error={
                                                        errors.maps_embed_url
                                                    }
                                                >
                                                    <Textarea
                                                        id="maps_embed_url"
                                                        name="maps_embed_url"
                                                        rows={3}
                                                        defaultValue={
                                                            settings.maps_embed_url ??
                                                            ''
                                                        }
                                                        onChange={(event) => {
                                                            const value =
                                                                event.target
                                                                    .value;
                                                            const src =
                                                                /src=["']([^"']+)["']/i.exec(
                                                                    value,
                                                                )?.[1];
                                                            setMapsPreview(
                                                                src ??
                                                                    value.trim(),
                                                            );
                                                        }}
                                                        placeholder='<iframe src="https://www.google.com/maps/embed?pb=..."></iframe>'
                                                    />
                                                </FormField>
                                                {mapsPreview.startsWith(
                                                    'https://www.google.com/maps/embed',
                                                ) ||
                                                mapsPreview.startsWith(
                                                    'https://maps.google.com/maps',
                                                ) ? (
                                                    <iframe
                                                        src={mapsPreview}
                                                        title="Pratinjau Google Maps"
                                                        className="aspect-video w-full rounded-xl border-0"
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    />
                                                ) : (
                                                    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-muted text-sm text-muted-foreground">
                                                        <MapPinIcon className="size-6" />
                                                        Pratinjau peta tampil di
                                                        sini
                                                    </div>
                                                )}
                                            </FieldGroup>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="social"
                                forceMount
                                className="data-[state=inactive]:hidden"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Media sosial</CardTitle>
                                        <CardDescription>
                                            Ikon tampil di footer website.
                                            Kosongkan yang tidak dipakai.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-5 md:grid-cols-2">
                                            {SOCIAL_FIELDS.map((field) => (
                                                <FormField
                                                    key={field.name}
                                                    label={field.label}
                                                    htmlFor={field.name}
                                                    error={errors[field.name]}
                                                >
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="url"
                                                        defaultValue={
                                                            settings[
                                                                field.name
                                                            ] ?? ''
                                                        }
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                    />
                                                </FormField>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent
                                value="seo"
                                forceMount
                                className="data-[state=inactive]:hidden"
                            >
                                <div className="grid items-start gap-6 xl:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>SEO default</CardTitle>
                                            <CardDescription>
                                                Dipakai di hasil pencarian
                                                Google untuk halaman yang tidak
                                                punya SEO sendiri.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldGroup className="gap-5">
                                                <FormField
                                                    label="Judul default"
                                                    htmlFor="seo_title"
                                                    description="Maksimal 70 karakter. Kosongkan untuk memakai nama website."
                                                    error={errors.seo_title}
                                                >
                                                    <Input
                                                        id="seo_title"
                                                        name="seo_title"
                                                        maxLength={70}
                                                        defaultValue={
                                                            settings.seo_title ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: Konsultan Teknologi & Transformasi Digital"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Deskripsi default"
                                                    htmlFor="seo_description"
                                                    description="Maksimal 160 karakter. Kosongkan untuk memakai tagline."
                                                    error={
                                                        errors.seo_description
                                                    }
                                                >
                                                    <Textarea
                                                        id="seo_description"
                                                        name="seo_description"
                                                        maxLength={160}
                                                        defaultValue={
                                                            settings.seo_description ??
                                                            ''
                                                        }
                                                        placeholder="Ringkasan singkat perusahaan untuk hasil pencarian."
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Kata kunci"
                                                    htmlFor="seo_keywords"
                                                    description="Pisahkan dengan koma."
                                                    error={errors.seo_keywords}
                                                >
                                                    <Input
                                                        id="seo_keywords"
                                                        name="seo_keywords"
                                                        defaultValue={
                                                            settings.seo_keywords ??
                                                            ''
                                                        }
                                                        placeholder="konsultan IT, transformasi digital, aplikasi custom"
                                                    />
                                                </FormField>
                                                <ImageUploadField
                                                    name="seo_og_image"
                                                    label="Gambar share"
                                                    description="Tampil saat link dibagikan di WhatsApp/LinkedIn. Ukuran ideal 1200×630, maksimal 2 MB."
                                                    accept="image/jpeg,image/png,image/webp"
                                                    currentUrl={
                                                        settings.seo_og_image_url
                                                    }
                                                    error={errors.seo_og_image}
                                                    previewClassName="h-20 w-36"
                                                />
                                            </FieldGroup>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Google</CardTitle>
                                            <CardDescription>
                                                Hubungkan website dengan Google
                                                Analytics dan Search Console.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldGroup className="gap-5">
                                                <FormField
                                                    label="ID Google Analytics"
                                                    htmlFor="google_analytics_id"
                                                    description="Format G-XXXXXXXXXX (Measurement ID GA4)."
                                                    error={
                                                        errors.google_analytics_id
                                                    }
                                                >
                                                    <Input
                                                        id="google_analytics_id"
                                                        name="google_analytics_id"
                                                        defaultValue={
                                                            settings.google_analytics_id ??
                                                            ''
                                                        }
                                                        placeholder="G-XXXXXXXXXX"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Kode verifikasi Search Console"
                                                    htmlFor="google_site_verification"
                                                    description="Isi nilai content dari tag meta google-site-verification."
                                                    error={
                                                        errors.google_site_verification
                                                    }
                                                >
                                                    <Input
                                                        id="google_site_verification"
                                                        name="google_site_verification"
                                                        defaultValue={
                                                            settings.google_site_verification ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: AbCdEf123..."
                                                    />
                                                </FormField>
                                            </FieldGroup>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="pages"
                                forceMount
                                className="data-[state=inactive]:hidden"
                            >
                                <div className="grid items-start gap-6 xl:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Halaman Keahlian
                                            </CardTitle>
                                            <CardDescription>
                                                Judul dan intro di bagian atas
                                                halaman /keahlian.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldGroup className="gap-5">
                                                <FormField
                                                    label="Judul halaman"
                                                    htmlFor="expertise_page_title"
                                                    required
                                                    error={
                                                        errors.expertise_page_title
                                                    }
                                                >
                                                    <Input
                                                        id="expertise_page_title"
                                                        name="expertise_page_title"
                                                        required
                                                        maxLength={100}
                                                        defaultValue={
                                                            settings.expertise_page_title ??
                                                            ''
                                                        }
                                                        placeholder="Contoh: Dari Strategi sampai Aplikasi yang Berjalan"
                                                    />
                                                </FormField>
                                                <FormField
                                                    label="Intro"
                                                    htmlFor="expertise_page_description"
                                                    required
                                                    description="Maksimal 400 karakter."
                                                    error={
                                                        errors.expertise_page_description
                                                    }
                                                >
                                                    <Textarea
                                                        id="expertise_page_description"
                                                        name="expertise_page_description"
                                                        required
                                                        maxLength={400}
                                                        defaultValue={
                                                            settings.expertise_page_description ??
                                                            ''
                                                        }
                                                        placeholder="Jelaskan secara singkat cara Anda mendampingi klien dari A sampai Z."
                                                    />
                                                </FormField>
                                            </FieldGroup>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <Card className="sticky bottom-4 z-10 border border-border py-3 shadow-[0_8px_30px_-12px_rgb(37_71_249_/_0.25)]">
                            <CardContent className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
                                <p className="text-sm text-muted-foreground">
                                    Semua tab tersimpan sekaligus.
                                </p>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="px-5"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Spinner data-icon="inline-start" />
                                    ) : (
                                        <SaveIcon data-icon="inline-start" />
                                    )}
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan pengaturan'}
                                </Button>
                            </CardContent>
                        </Card>
                    </>
                )}
            </Form>
        </>
    );
}

WebsiteSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pengaturan Website', href: edit() },
    ],
    title: 'Pengaturan Website',
    description:
        'Nama website, logo, favicon, kontak, Google Maps, media sosial, SEO, dan intro halaman.',
};
