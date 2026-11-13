# Tasklist

Status: `[x]` selesai, `[ ]` belum. File ini diperbarui setiap kali pekerjaan selesai.
Referensi: `PRD.md` (fitur), `ERD.md` (database), `DESIGN-SYSTEM.md` (UI).

---

## Fase 0: Persiapan dan Fondasi

### Riset dan perencanaan

- [x] Setup project Laravel 13 + Inertia v3 React starter kit (Fortify, 2FA, passkey)
- [x] Riset struktur informasi suitmedia.com (Work, Expertises, Solutions, Industries, Insights, About, Contact)
- [x] Menyusun positioning "konsultan A–Z" dan sitemap publik + admin
- [x] Menyusun rencana fase 1–3
- [x] Riset gaya visual buildwithangga.com (warna, card, tombol, tipografi)

### Dokumentasi

- [x] `docs/PRD.md`
- [x] `docs/ERD.md`
- [x] `docs/TASKLIST.md`
- [x] `docs/DESIGN-SYSTEM.md`

### Fondasi design system

- [x] Token warna baru (primary `#2547F9`, background `#F7F8FD`, card `#FFFFFF`)
- [x] Font Poppins (Google Fonts)
- [x] Smooth scroll
- [x] Hapus dark mode (CSS, blade, middleware, hook, halaman Appearance, class `dark:`)
- [x] Tambah komponen shadcn: table, textarea, alert-dialog, field, empty, pagination, popover
- [x] Komponen `PageHeader` (breadcrumb + title + description), wajib lewat layout
- [x] Komponen `DataTable` (kolom No, search, sort, pagination, empty state)
- [x] Komponen `RowActions` (titik 3) + `ConfirmDialog`
- [x] Komponen `FormField` (required `*` merah, placeholder wajib)
- [x] Rapikan halaman yang sudah ada: dashboard, settings, auth
- [x] Verifikasi: type check, lint, build, 42 test Pest lolos, cek visual (desktop + mobile)
- [ ] Lokalisasi teks bawaan starter kit (auth, settings, pesan validasi) ke bahasa Indonesia

---

## Fase 1: MVP

Prioritas: **panel admin dulu**, website publik menyusul.

### Database

- [x] Migration `is_admin` di `users` + Gate `access-admin` + middleware `can:access-admin`
- [x] Enum: `LeadStatus`, `ServicePillar`, `BusinessFunction`, `CompanySize`, `ProjectTimeline`, `BudgetRange`, `LeadActivityType`
- [x] Migration + model + factory: `industries`, `services`, `case_studies`, `case_study_service`
- [x] Migration + model + factory: `consultation_requests`, `lead_activities`
- [x] Seeder konten contoh (6 industri, 6 layanan, 3 studi kasus) + user admin (`admin@example.com`)
- [x] `DemoSeeder` terpisah: 20 data fiktif-realistis per menu + gambar (Unsplash, avatar DiceBear, logo SVG) di `storage/app/public/demo`. Jalankan manual: `php artisan db:seed --class=DemoSeeder`. Hapus data demo sebelum live
- [x] Registrasi publik dimatikan (akun admin dari seeder)

### Panel admin

- [x] Layout + navigasi admin (Dashboard, Lead Konsultasi, Studi Kasus, Layanan, Industri, Lihat Website)
- [x] Dashboard ringkasan lead (statistik, lead terbaru, lead per status)
- [x] Lead: list (DataTable server-side: search, filter status, pagination), detail, ubah status, assign PIC, catatan, hapus
- [x] CRUD Studi Kasus (upload/hapus cover, pilih industri & layanan, hasil terukur dinamis, unggulan, publish)
- [x] CRUD Layanan (pilar, deliverable per baris, pilih ikon, publish)
- [x] CRUD Industri (masalah umum per baris, pilih ikon, publish)
- [x] Pesan validasi bahasa Indonesia untuk semua form admin
- [x] Cek visual di browser (dashboard, lead, form studi kasus, layanan, industri)
- [x] Sidebar baru: menu dikelompokkan (Utama, Penjualan, Konten Website), badge jumlah lead baru, logo + "Panel Admin"
- [x] Topbar baru: pencarian menu (command palette ⌘K / Ctrl+K), lonceng notifikasi dengan Sheet, avatar + menu akun
- [x] Notifikasi database "lead baru" untuk semua admin (tandai dibaca, tandai semua dibaca)

### Penyesuaian struktur dengan suitmedia.com

- [x] Studi kasus: periode proyek, tipe organisasi, galeri gambar, insight untuk pimpinan, SEO
- [x] Layanan: `deliverables` diganti `capabilities` (judul + deskripsi) + metodologi + SEO (data lama otomatis dimigrasi)
- [x] Industri: SEO
- [x] Logo klien per industri ("Trusted Partners") + CRUD admin
- [x] Insight/artikel + relasi ke layanan + CRUD admin
- [x] Perjalanan perusahaan (milestone) + CRUD admin
- [x] Kantor pusat & cabang + CRUD admin
- [x] Terjemahan Laravel bahasa Indonesia (`lang/id`): validasi, login, reset password
- [x] Tampilkan galeri, insight, dan metodologi di website publik
- [ ] Tampilkan logo klien, artikel, milestone, dan kantor di website publik (halaman Insight, Tentang, Kontak)
- [x] Semua tombol memakai ikon + teks (aturan di DESIGN-SYSTEM.md)

### Kelengkapan panel admin

- [x] Pengguna: tambah, edit, reset password, cabut akses admin, hapus (tidak bisa hapus/cabut akun sendiri)
- [x] Solusi per divisi bisnis + relasi ke studi kasus
- [x] Bidang Keahlian (pengganti enum pilar) + halaman publik `/keahlian` bergaya Suitmedia Expertises, intro dari Pengaturan Website, insight terkait, redirect `/layanan`
- [x] Halaman publik Insight (`/insight`, `/insight/{slug}`) dengan filter kategori
- [x] Rich text editor (Tiptap) untuk 9 field konten panjang + sanitasi HTML di server (symfony/html-sanitizer) + migration konversi teks lama ke HTML
- [x] Produk milik perusahaan (admin CRUD, `/produk`, section Beranda) + `ProductSeeder` berisi LegalPartner.ID, ChatCepat, KarirConnect dengan logo & cover di `database/seeders/assets/products`
- [x] FAQ (halaman statis, layanan, industri, solusi)
- [x] Tim (foto, jabatan, LinkedIn)
- [x] Testimoni (foto, terkait studi kasus)
- [x] Email notifikasi lead baru ke semua admin (queue; notifikasi lonceng tetap langsung)
- [x] Caption dan urutan gambar galeri studi kasus
- [x] Pengaturan Website 4 tab: nama website, tagline, teks footer, logo, favicon; kontak, jam operasional, Google Maps embed; 6 media sosial; SEO default, kata kunci, gambar share (OG), Google Analytics, verifikasi Search Console
- [x] Logo, nama, favicon, SEO, Open Graph, dan Analytics dipakai otomatis di website, panel admin, halaman login, dan tag `<head>`
- [x] Data Terhapus: pulihkan / hapus permanen (termasuk file gambar)

### Dashboard

- [x] KPI: lead bulan ini (vs bulan lalu), lead dalam proses, tingkat konversi, lead tanpa PIC
- [x] Grafik ApexCharts: tren lead (6 bulan / 30 hari), posisi lead per status, area masalah, lead per industri (top 5 + Lainnya)
- [x] Daftar "Perlu ditindaklanjuti", lead terbaru, ringkasan konten terbit/draft

### Kualitas & pengujian

- [x] Preview gambar sebelum upload di semua form (cover, galeri, logo, favicon, gambar share, foto tim & testimoni, logo klien)
- [x] Test E2E Playwright (`npm run test:e2e`): 53 skenario — semua halaman publik & admin, sidebar, Ctrl+K, CRUD, upload + preview, Data Terhapus, lead + lonceng + riwayat, pengguna, pengaturan website
- [x] Feature test Pest: 178 test

### Website publik

- [x] Layout publik (navbar, footer, CTA konsultasi)
- [x] Beranda
- [x] Cara Kami Bekerja (7 tahap)
- [x] Layanan (list + detail)
- [x] Industri (list + detail)
- [x] Studi Kasus (list dengan filter industri/layanan + detail per tahap konsultasi, metrik, galeri, insight)
- [x] Form Konsultasi 3 langkah (validasi per langkah, UTM & halaman asal tercatat, honeypot, rate limit) + halaman terima kasih
- [ ] Cek visual website publik

### Test

- [x] Feature test: akses admin (tamu, user biasa, admin, gate)
- [x] Feature test: dashboard admin
- [x] Feature test: lead (search, filter, pagination, ubah status & PIC tercatat di aktivitas, catatan, hapus)
- [x] Feature test: CRUD studi kasus, layanan, industri (termasuk upload cover dan validasi)
- [x] Feature test: submit form konsultasi (valid + notifikasi admin, invalid, honeypot, rate limit)
- [x] Feature test: notifikasi admin (buka, milik admin lain 404, tandai semua dibaca, shared props)
- [x] Feature test: halaman publik (semua komponen halaman ada, draft 404, filter studi kasus)

---

## Fase 2

- [x] Migration + model: `solutions`, `case_study_solution`, `articles`, `faqs`, `team_members`, `testimonials`, `client_logos`
- [ ] Halaman Solusi, Insight (list + detail), Tentang & Tim
- [ ] FAQ di Cara Kerja, Layanan, Industri
- [x] CRUD admin untuk semua entitas di atas
- [ ] Editor teks artikel (butuh persetujuan dependency)
- [x] Notifikasi email lead baru ke admin (queue)
- [ ] SEO: SSR, meta + Open Graph per halaman, `sitemap.xml`, schema.org

## Fase 3

- [ ] Dua bahasa (ID/EN)
- [ ] Pipeline lead model kanban
- [ ] Tombol WhatsApp
- [ ] Analytics
