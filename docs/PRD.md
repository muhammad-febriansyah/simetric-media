# PRD — Website Company Profile Konsultan Teknologi

| Item                         | Keterangan                                                     |
| ---------------------------- | -------------------------------------------------------------- |
| Produk                       | Website company profile + CMS + manajemen lead konsultasi      |
| Versi dokumen                | 1.0                                                            |
| Tanggal                      | 13 November 2026                                               |
| Stack                        | Laravel 13, Inertia v3, React 19, Tailwind v4, shadcn/ui, Pest |
| Referensi struktur informasi | suitmedia.com (struktur saja, bukan UI)                        |
| Referensi gaya visual        | buildwithangga.com (lihat `DESIGN-SYSTEM.md`)                  |

---

## 1. Latar Belakang

Banyak perusahaan industri membutuhkan solusi teknologi, tetapi tidak memahami teknologi itu sendiri. Mereka tidak hanya mencari vendor pembuat aplikasi. Mereka butuh pendamping dari **A sampai Z**: mulai konsultasi awal sampai solusi aplikasi benar-benar berjalan di perusahaan mereka.

Sebagian besar perusahaan teknologi hanya menonjolkan **produk**. Mereka tidak mengomunikasikan diri sebagai **konsultan** yang memahami masalah bisnis klien. Di celah inilah website ini berdiri.

## 2. Positioning

> "Kami bukan sekadar pembuat aplikasi. Kami konsultan teknologi yang mendampingi bisnis Anda dari memahami masalah sampai solusi berjalan."

Prinsip komunikasi:

1. **Masalah dulu, teknologi kemudian.** Layanan dan solusi ditulis dari sudut pandang masalah klien. Contoh: "Stok gudang tidak sinkron", bukan "Inventory Management System".
2. **Proses terlihat.** Proses konsultasi 7 tahap tampil di menu utama dan di beranda.
3. **Bukti per tahap.** Studi kasus menceritakan perjalanan konsultasi, bukan hanya screenshot aplikasi.
4. **CTA tunggal dan jelas.** "Konsultasi Gratis" tampil di semua halaman.
5. **UI terasa seperti perusahaan teknologi**: bersih, modern, dan cepat.

## 3. Tujuan dan Metrik Sukses

| Tujuan                       | Metrik                                                               | Target awal                   |
| ---------------------------- | -------------------------------------------------------------------- | ----------------------------- |
| Menghasilkan lead konsultasi | Jumlah form konsultasi masuk per bulan                               | ≥ 10                          |
| Kualitas lead                | % lead yang lanjut ke Discovery Call                                 | ≥ 40%                         |
| Pengunjung paham positioning | Kunjungan halaman "Cara Kami Bekerja" dari total sesi                | ≥ 25%                         |
| Ditemukan di mesin pencari   | Halaman terindeks dan peringkat kata kunci "konsultan IT [industri]" | Terindeks 100% halaman publik |
| Respons cepat                | Waktu dari lead masuk sampai pertama di-follow-up                    | ≤ 1 hari kerja                |

## 4. Persona

**A. Decision maker industri (pengunjung utama)**

- Pemilik, direktur, atau manajer operasional di manufaktur, distribusi, konstruksi, atau perusahaan jasa.
- Paham masalah bisnisnya, tetapi tidak paham teknologi.
- Butuh rasa aman: "Apakah mereka mengerti bisnis saya? Apakah pernah menangani kasus serupa?"
- Mengambil keputusan berdasarkan studi kasus, proses yang jelas, dan kepercayaan.

**B. Admin internal (pengguna CMS)**

- Tim marketing atau sales internal.
- Mengelola konten (studi kasus, layanan, artikel) dan menindaklanjuti lead.
- Butuh panel yang rapi, cepat, dan tidak teknis.

## 5. Sitemap

### 5.1 Website publik

| Halaman           | URL                                   | Tujuan                                                                                                                            |
| ----------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Beranda           | `/`                                   | Menyampaikan positioning konsultan, alur A–Z ringkas, studi kasus unggulan, industri, dan CTA                                     |
| Cara Kami Bekerja | `/cara-kerja`                         | Menjelaskan 7 tahap konsultasi beserta FAQ                                                                                        |
| Keahlian          | `/keahlian`, `/keahlian/{slug}`       | Bidang keahlian (dikelola di admin) berisi layanan + insight terkait; `/layanan` redirect 301                                     |
| Solusi            | `/solusi`, `/solusi/{slug}`           | Solusi per divisi bisnis: Operasional, Penjualan, Keuangan, SDM, IT                                                               |
| Industri          | `/industri`, `/industri/{slug}`       | Pain point per industri dan studi kasus terkait                                                                                   |
| Studi Kasus       | `/studi-kasus`, `/studi-kasus/{slug}` | Bukti kerja, dengan filter industri dan layanan                                                                                   |
| Produk            | `/produk`, `/produk/{slug}`           | Produk digital milik perusahaan (LegalPartner.ID, ChatCepat, KarirConnect) sebagai bukti kemampuan membangun aplikasi sampai live |
| Insight           | `/insight`, `/insight/{slug}`         | Artikel untuk SEO dan menunjukkan keahlian, filter kategori (sudah ada)                                                           |
| Tentang           | `/tentang`                            | Profil, nilai perusahaan, tim                                                                                                     |
| Konsultasi        | `/konsultasi`                         | Form konsultasi multi-step (CTA utama)                                                                                            |

### 5.2 Panel admin (`/admin`, wajib login + `is_admin`)

| Menu                                      | Fungsi                                                                |
| ----------------------------------------- | --------------------------------------------------------------------- |
| Dashboard                                 | Ringkasan lead baru, lead per status, konten terbaru                  |
| Lead Konsultasi                           | List (data table), detail, ubah status, assign PIC, catatan aktivitas |
| Studi Kasus                               | CRUD + publish/unpublish                                              |
| Bidang Keahlian                           | CRUD pilar layanan (nama, deskripsi, ikon, urutan, terbit, SEO)       |
| Layanan                                   | CRUD, wajib memilih bidang keahlian                                   |
| Solusi                                    | CRUD + fitur + SEO (sudah ada)                                        |
| Produk                                    | CRUD + logo, cover, fitur, angka sorotan, tampil di Beranda, SEO      |
| Industri                                  | CRUD                                                                  |
| Insight                                   | CRUD artikel + layanan terkait + SEO (sudah ada)                      |
| FAQ                                       | CRUD, dikaitkan ke halaman/layanan/industri/solusi (sudah ada)        |
| Logo Klien, Perjalanan Perusahaan, Kantor | CRUD (sudah ada)                                                      |
| Tim, Testimoni                            | CRUD dengan foto (sudah ada)                                          |
| Pengguna                                  | Tambah/edit/hapus akun admin, reset password (sudah ada)              |
| Pengaturan Website                        | Tagline, kontak, WhatsApp, media sosial (sudah ada)                   |
| Data Terhapus                             | Pulihkan atau hapus permanen lead, studi kasus, artikel (sudah ada)   |
| Pengaturan Akun                           | Profil, keamanan (2FA, passkey) — sudah ada dari starter kit          |

## 6. Kebutuhan Fungsional

### 6.1 Website publik

- **F-PUB-01** Beranda menampilkan: hero berisi positioning konsultan, ringkasan 7 tahap konsultasi, studi kasus unggulan (`is_featured`), daftar industri, logo klien, testimoni, dan CTA konsultasi.
- **F-PUB-02** Halaman "Cara Kami Bekerja" menampilkan 7 tahap. Setiap tahap memiliki judul, penjelasan, deliverable untuk klien, dan durasi indikatif.
- **F-PUB-03** Layanan dan Solusi menampilkan masalah yang diselesaikan, pendekatan, deliverable, dan studi kasus terkait.
- **F-PUB-04** Halaman industri menampilkan pain point umum industri tersebut dan studi kasus yang relevan.
- **F-PUB-05** List studi kasus bisa difilter per industri dan layanan, dengan pagination.
- **F-PUB-06** Detail studi kasus berstruktur: Tantangan → Temuan Assessment → Rekomendasi → Solusi → Hasil (metrik).
- **F-PUB-07** Form konsultasi multi-step:
    1. Data diri: nama\*, email kerja\*, nomor HP\*, jabatan.
    2. Perusahaan: nama perusahaan\*, industri\*, ukuran perusahaan.
    3. Kebutuhan: area masalah\*, deskripsi masalah\*, target waktu, kisaran budget.
    - Semua field wajib bertanda `*` merah dan semua input memiliki placeholder.
    - Proteksi spam: honeypot + rate limit.
    - Setelah submit: muncul toast sukses dan halaman terima kasih yang menjelaskan langkah berikutnya.
- **F-PUB-08** Halaman dalam (selain Beranda) wajib memiliki breadcrumb, judul, dan deskripsi.
- **F-PUB-09** Parameter UTM dan halaman asal disimpan bersama lead.

### 6.2 Panel admin

- **F-ADM-01** Hanya user dengan `is_admin = true` yang bisa mengakses `/admin`.
- **F-ADM-02** Setiap list memakai DataTable: kolom **No**, pencarian, sort, pagination, dan aksi baris lewat tombol titik 3 (Lihat/Edit/Hapus).
- **F-ADM-03** Hapus data selalu lewat dialog konfirmasi, lalu muncul toast sonner.
- **F-ADM-04** Lead memiliki status: `new`, `discovery_call`, `assessment`, `proposal`, `won`, `lost`. Setiap perubahan status tercatat di `lead_activities`.
- **F-ADM-05** Lead bisa di-assign ke PIC (user admin) dan diberi catatan follow-up.
- **F-ADM-06** Konten memiliki status draft/publish (`published_at`) dan urutan tampil (`sort_order`).
- **F-ADM-07** Upload gambar (cover, logo, foto tim) disimpan di disk `public`.
- **F-ADM-08** Email notifikasi ke admin saat ada lead baru (sudah ada, lewat queue).

## 7. Alur Konsultasi (konten "Cara Kami Bekerja")

1. **Konsultasi Awal (gratis)**: mendengarkan masalah bisnis klien.
2. **Discovery & Assessment**: memetakan proses bisnis, sistem yang sudah ada, dan kebutuhan.
3. **Rekomendasi & Roadmap**: solusi yang diusulkan, prioritas, estimasi biaya dan waktu.
4. **Desain & Prototipe**: alur dan tampilan divalidasi bersama klien sebelum dibangun.
5. **Pengembangan**: pembangunan iteratif dengan demo berkala.
6. **Implementasi & Training**: go-live, migrasi data, dan pelatihan pengguna.
7. **Pendampingan**: support, maintenance, dan pengembangan lanjutan.

## 8. Alur Lead

```
Form konsultasi → [new] → [discovery_call] → [assessment] → [proposal] → [won] / [lost]
```

Setiap transisi dicatat (siapa, kapan, catatan) dan bisa dilihat di detail lead.

## 9. Kebutuhan Non-Fungsional

| Kode  | Kebutuhan                                                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| NF-01 | SEO: SSR Inertia untuk halaman publik, meta title/description per halaman, Open Graph, `sitemap.xml`, schema.org (Organization, Article) |
| NF-02 | Performa: LCP < 2.5 detik di 4G, gambar dioptimasi, tanpa N+1 query                                                                      |
| NF-03 | Responsif mulai lebar 360px, tanpa scroll horizontal                                                                                     |
| NF-04 | Aksesibilitas: kontras AA, label form, fokus keyboard terlihat                                                                           |
| NF-05 | Tampilan **light mode saja**, smooth scroll, mengikuti `DESIGN-SYSTEM.md`                                                                |
| NF-06 | Keamanan: validasi lewat Form Request, CSRF, rate limit form publik, otorisasi admin lewat Gate                                          |
| NF-07 | Kualitas: feature test Pest untuk alur penting, Pint, type check TypeScript                                                              |

## 10. Fase Rilis

| Fase         | Isi                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| Fondasi      | Docs, design system, komponen standar                                                                              |
| Fase 1 (MVP) | Database inti, Beranda, Cara Kerja, Layanan, Industri, Studi Kasus, form Konsultasi, admin CRUD + kotak masuk lead |
| Fase 2       | Insight, Solusi, FAQ, Tentang & Tim, notifikasi email lead, SEO lengkap                                            |
| Fase 3       | Dua bahasa (ID/EN), pipeline lead kanban, tombol WhatsApp, analytics                                               |

Rincian tugas ada di `TASKLIST.md`.

## 11. Di Luar Scope

- Katalog produk/paket jasa untuk dijual (diganti dengan Solusi berbasis masalah). Menu Produk hanya menampilkan produk digital milik perusahaan sebagai portofolio.
- Portal klien atau login untuk klien.
- Pembayaran online.
- Dark mode.
- Halaman karier dan lowongan kerja.
- Halaman sustainability.

## 12. Pertanyaan Terbuka

- Nama brand final, logo, dan tagline.
- 3–5 studi kasus nyata beserta izin publikasi dan angka hasilnya.
- Daftar industri yang benar-benar dilayani.
- Logo klien yang boleh ditampilkan.
- Kontak resmi: alamat kantor, email, nomor WhatsApp.
