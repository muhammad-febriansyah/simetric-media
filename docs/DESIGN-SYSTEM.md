# Design System

Gaya visual mengacu ke buildwithangga.com: bersih, terang, card putih di atas latar abu kebiruan, tombol pill biru, dan font Poppins. Semua komponen memakai **shadcn/ui** (style `new-york`, base `radix`, ikon `lucide-react`).

Aturan dasar:

- **Light mode saja.** Tidak ada dark mode, dan class `dark:` tidak boleh dipakai.
- **Smooth scroll** aktif global (otomatis mati jika pengguna memilih reduced motion).
- Warna selalu lewat token semantik (`bg-primary`, `text-muted-foreground`). Jangan pakai warna mentah seperti `bg-blue-500` atau `#2547F9` di komponen.

---

## 1. Warna

Didefinisikan di `resources/css/app.css` (`:root`).

| Token                    | Hex       | Kegunaan                                |
| ------------------------ | --------- | --------------------------------------- |
| `--background`           | `#F7F8FD` | Latar halaman                           |
| `--foreground`           | `#34364A` | Teks utama                              |
| `--card` / `--popover`   | `#FFFFFF` | Card, dropdown, dialog                  |
| `--primary`              | `#2547F9` | Tombol utama, link, fokus, elemen aktif |
| `--primary-foreground`   | `#FFFFFF` | Teks di atas primary                    |
| `--secondary`            | `#E5E9F2` | Tombol sekunder                         |
| `--secondary-foreground` | `#34364A` | Teks di atas secondary                  |
| `--muted`                | `#EEF1F8` | Latar header tabel, area netral         |
| `--muted-foreground`     | `#7A7D92` | Deskripsi, placeholder, teks sekunder   |
| `--accent`               | `#EEF1FE` | Hover item menu dan baris               |
| `--accent-foreground`    | `#2547F9` | Teks item aktif atau hover              |
| `--border` / `--input`   | `#E5E9F2` | Garis dan border input                  |
| `--ring`                 | `#2547F9` | Outline fokus                           |
| `--destructive`          | `#EF4444` | Hapus, error, tanda `*` required        |
| `--success`              | `#47BB8E` | Status sukses (Badge `success`)         |

## 2. Tipografi

Font: **Poppins** (Google Fonts), berat 400, 500, 600, 700. Dimuat lewat `google()` di `vite.config.ts`.

| Elemen             | Kelas Tailwind                               |
| ------------------ | -------------------------------------------- |
| Judul halaman (h1) | `text-2xl font-semibold`                     |
| Judul card         | `text-lg font-semibold` (bawaan `CardTitle`) |
| Teks isi           | `text-sm` / `text-base`                      |
| Deskripsi          | `text-sm text-muted-foreground`              |
| Label form         | `text-sm font-medium`                        |
| Caption / meta     | `text-xs text-muted-foreground`              |

Hero website publik boleh memakai `text-4xl md:text-5xl font-bold`.

## 3. Bentuk dan Jarak

| Elemen                      | Aturan                                                            |
| --------------------------- | ----------------------------------------------------------------- |
| Card                        | `rounded-2xl`, putih, tanpa border, tanpa shadow, padding 20–24px |
| Tombol                      | Pill `rounded-full`, `font-semibold`, tinggi 44px (default)       |
| Input, Select, Textarea     | `rounded-xl`, tinggi 44px                                         |
| Dropdown, Dialog            | `rounded-xl` / `rounded-2xl`                                      |
| Jarak antar section di page | `gap-6`                                                           |
| Jarak antar field form      | `gap-5` (`FieldGroup`)                                            |

Untuk jarak, pakai `flex flex-col gap-*`, bukan `space-y-*`.

## 4. Aturan Halaman

Berlaku untuk **semua halaman admin** dan **halaman dalam website publik**. Beranda publik dikecualikan dan boleh memakai layout landing.

1. Setiap halaman wajib memiliki **breadcrumb, title, dan description**. Ketiganya dirender otomatis oleh layout dari properti `layout` halaman. Ketiganya **tidak** dibungkus card.
    - Untuk judul **dinamis** (misalnya nama lead atau "Edit Studi Kasus"), halaman merender `<PageHeader breadcrumbs title description />` sendiri sebagai elemen pertama. Jangan pakai `setLayoutProps`, karena nilainya bisa terbawa ke halaman berikutnya setelah redirect.
2. **Seluruh isi halaman dibungkus `Card`.**

```tsx
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/admin/case-studies';

export default function CaseStudyIndex() {
    return (
        <>
            <Head title="Studi Kasus" />
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Studi Kasus</CardTitle>
                </CardHeader>
                <CardContent>{/* isi */}</CardContent>
            </Card>
        </>
    );
}

CaseStudyIndex.layout = {
    breadcrumbs: [{ title: 'Studi Kasus', href: index() }],
    title: 'Studi Kasus',
    description: 'Kelola studi kasus yang tampil di website.',
};
```

## 5. Tombol

| Variant       | Kegunaan                                      |
| ------------- | --------------------------------------------- |
| `default`     | Aksi utama (Simpan, Kirim, Konsultasi Gratis) |
| `secondary`   | Aksi kedua (Batal, Lihat Katalog)             |
| `outline`     | Aksi netral di dalam card                     |
| `ghost`       | Tombol ikon (titik 3, toggle sidebar)         |
| `destructive` | Konfirmasi hapus di dialog                    |

**Setiap tombol wajib berisi ikon + teks.** Ikon (lucide) di kiri teks memakai `data-icon="inline-start"`; ikon panah "lanjut" boleh di kanan dengan `data-icon="inline-end"`. Jangan beri kelas ukuran pada ikon. Pengecualian hanya untuk tombol ikon kecil yang fungsinya sudah umum (titik 3 aksi baris, lonceng, buka/tutup sidebar, hapus baris pada daftar dinamis); tombol ini wajib punya teks `sr-only`.

Saat proses, ganti ikon dengan `Spinner` dan ubah teks bila perlu (misalnya "Menyimpan..."), lalu `disabled`:

```tsx
<Button type="submit" disabled={processing}>
    {processing ? (
        <Spinner data-icon="inline-start" />
    ) : (
        <SaveIcon data-icon="inline-start" />
    )}
    {processing ? 'Menyimpan...' : 'Simpan'}
</Button>
```

## 6. Form

- Layout form memakai `FieldGroup` dan komponen `FormField` (`@/components/form-field`).
- Field **wajib** diberi prop `required`. Komponen ini otomatis menampilkan **`*` merah** setelah label.
- **Semua input wajib memiliki `placeholder`.** Prop ini dibuat wajib di tipe `Input` dan `Textarea`, jadi type check akan gagal jika lupa.
- Pesan error tampil di bawah field (`error` prop). Field ditandai `data-invalid` dan kontrolnya `aria-invalid`.
- **Konten panjang pakai `RichTextEditor`** (`@/components/admin/rich-text-editor`, Tiptap): isi artikel, tantangan/temuan/rekomendasi/solusi studi kasus, penjelasan detail layanan/solusi/produk, dan jawaban FAQ (`compact`). Ringkasan, tagline, kutipan, bio, dan meta tetap `Textarea` biasa karena dipakai di kartu dan SEO. Isi editor dikirim sebagai HTML lewat input tersembunyi, disanitasi di server (`App\Support\RichText` via `mergeRichText()` di form request), dan kolomnya memakai cast `RichTextHtml`. Di halaman publik tampilkan dengan `<RichText html={...} />` (kelas `.rich-text`). Tombol toolbar editor berupa ikon + tooltip (pengecualian aturan ikon + teks agar toolbar tetap ringkas).
- **Upload gambar wajib bisa dipreview sebelum disimpan.** Pakai `ImageUploadField` (`@/components/admin/image-upload-field`), jangan `<Input type="file">` langsung. Komponen ini menampilkan gambar yang baru dipilih (label "Baru dipilih", nama + ukuran file, tombol "Batal pilih"), gambar saat ini, dan opsi hapus. Untuk banyak file pakai prop `multiple` (grid pratinjau). Foto orang pakai `PhotoField` (pratinjau bulat).
- Form admin diakhiri `FormActions` (`@/components/admin/form-actions`): bar ramping yang menempel di bawah, berisi petunjuk "Kolom bertanda * wajib diisi" di kiri serta tombol **Batal** (secondary) dan **Simpan** (primary, ikon simpan, teks "Menyimpan..." saat proses) di kanan.

```tsx
<FieldGroup>
    <FormField
        label="Nama perusahaan"
        htmlFor="company_name"
        required
        error={errors.company_name}
    >
        <Input
            id="company_name"
            name="company_name"
            placeholder="Contoh: PT Maju Jaya"
            required
        />
    </FormField>
    <FormField label="Jabatan" htmlFor="job_title" description="Opsional">
        <Input
            id="job_title"
            name="job_title"
            placeholder="Contoh: Manajer Operasional"
        />
    </FormField>
</FieldGroup>
```

## 7. List dan DataTable

Setiap list data memakai `DataTable` (`@/components/data-table/data-table`), berbasis TanStack Table sesuai pola shadcn data-table.

- Kolom **No** ditambahkan otomatis sebagai kolom pertama, dan nomornya berlanjut antar halaman.
- Fitur bawaan: pencarian (`searchKey`), sort lewat `DataTableColumnHeader`, pagination, dan empty state (`Empty`).
- Kolom aksi selalu di paling kanan dan memakai `RowActions`.
- Data kecil (konten CMS) dipaginasi di browser. Data yang bisa banyak (lead) memakai **pagination server**: kirim `serverPagination` (`meta` dari paginator Laravel + callback ganti halaman) dan `serverSearch`.
- Tabel pendek (misalnya "5 terbaru") boleh menyembunyikan pagination dengan `showPagination={false}`.

```tsx
const columns: ColumnDef<CaseStudy>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Judul" />
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <RowActions
                viewHref={show(row.original.id)}
                editHref={edit(row.original.id)}
                onDelete={() => router.delete(destroy(row.original.id))}
                itemLabel={row.original.title}
            />
        ),
    },
];

<DataTable
    columns={columns}
    data={caseStudies}
    searchKey="title"
    searchPlaceholder="Cari judul studi kasus..."
/>;
```

## 8. Aksi Baris (titik 3)

- Aksi per baris **hanya** lewat tombol titik 3 (`MoreHorizontal`, variant `ghost`) yang membuka `DropdownMenu`: **Lihat**, **Edit**, dan **Hapus** (warna destructive, dipisah `Separator`).
- **Hapus selalu lewat `ConfirmDialog`** (AlertDialog) sebelum dieksekusi.

## 9. Notifikasi (Sonner)

- Semua notifikasi memakai toast **sonner**, posisi kanan atas, dengan warna per jenis (`richColors`).
- Dari backend, kirim lewat flash Inertia. Hook `useFlashToast` sudah membacanya otomatis:

```php
Inertia::flash('toast', ['type' => 'success', 'message' => 'Studi kasus berhasil disimpan.']);

return to_route('admin.case-studies.index');
```

- Dari frontend: `toast.success('Tersimpan')`, `toast.error('Gagal menyimpan')`.
- Jenis toast: `success`, `info`, `warning`, `error`.

## 10. Layout Panel Admin

- **Sidebar** (`app-sidebar.tsx`): logo + nama + "Panel Admin", menu dikelompokkan dengan label kecil kapital, item aktif berlatar `accent` dan teks `primary`, badge bulat `primary` untuk jumlah lead baru, tautan "Lihat website" di bawah. Daftar menu ada di `components/admin/admin-navigation.ts` dan dipakai bersama oleh sidebar dan pencarian menu.
- **Topbar** (`app-sidebar-header.tsx`), menempel di atas: tombol sidebar, **pencarian menu** (`CommandMenu`, shadcn `Command` dalam dialog, buka dengan klik atau ⌘K / Ctrl+K), **lonceng notifikasi** (`NotificationSheet`, shadcn `Sheet` dari kanan, titik biru untuk yang belum dibaca), dan **avatar** (`UserDropdown`) dengan menu Profil, Keamanan, Lihat website, Keluar.
- Menu baru cukup ditambahkan di `admin-navigation.ts`, otomatis muncul di sidebar dan pencarian.

## 11. Grafik (ApexCharts)

- Pakai komponen di `@/components/admin/charts` (`LeadTrendChart`, `HorizontalBarChart`) lewat `lazy-charts`, sehingga ApexCharts dimuat terpisah dengan skeleton.
- Warna, font, dan grid diambil dari token CSS (`chart-theme.ts`): satu seri = warna `primary`, grid garis putus tipis, teks label memakai warna teks (bukan warna seri).
- Pilih bentuk sesuai tugas data: tren waktu = area chart, perbandingan kategori = bar horizontal (diurutkan), angka utama = kartu KPI (bukan grafik). Jangan pakai dua sumbu Y.
- Saat data kosong tampilkan `Empty`, bukan grafik kosong.

## 12. Komponen Lain

| Kebutuhan                      | Komponen                                                              |
| ------------------------------ | --------------------------------------------------------------------- |
| Status                         | `Badge` (`default`, `secondary`, `success`, `destructive`, `outline`) |
| Pesan penting di dalam halaman | `Alert`                                                               |
| Data kosong                    | `Empty`                                                               |
| Loading                        | `Skeleton`, `Spinner`                                                 |
| Konfirmasi                     | `AlertDialog` (lewat `ConfirmDialog`)                                 |
| Form di panel samping          | `Sheet`                                                               |
| Pemisah                        | `Separator`                                                           |

## 13. Do dan Don't

| Do                                                  | Don't                                                     |
| --------------------------------------------------- | --------------------------------------------------------- |
| Pakai komponen shadcn yang ada di `@/components/ui` | Membuat div bergaya sendiri untuk card, badge, atau alert |
| Bungkus isi halaman dengan `Card`                   | Menaruh tabel atau form langsung di latar halaman         |
| Tandai field wajib dengan `required`                | Menulis `*` manual di label                               |
| Beri placeholder yang memberi contoh isi            | Placeholder yang mengulang label ("Nama")                 |
| Aksi baris lewat titik 3                            | Deretan tombol Edit/Hapus di setiap baris                 |
| Toast sonner untuk hasil aksi                       | `alert()` atau teks status manual                         |
| Token warna semantik                                | Warna hex atau class warna Tailwind mentah                |
| `gap-*` untuk jarak                                 | `space-y-*` / `space-x-*`                                 |
