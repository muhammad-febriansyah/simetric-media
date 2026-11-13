<?php

namespace Database\Seeders;

use App\Enums\BusinessFunction;
use App\Enums\OfficeType;
use App\Enums\OrganizationType;
use App\Enums\ServicePillar;
use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\CompanyMilestone;
use App\Models\Faq;
use App\Models\Industry;
use App\Models\Office;
use App\Models\Service;
use App\Models\Solution;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    /**
     * Seed example website content: industries, services, case studies, articles,
     * solutions, FAQs, company milestones and offices. Client logos, team members and
     * testimonials must be real, so none are seeded.
     */
    public function run(): void
    {
        $industries = collect([
            ['Manufaktur', 'factory', 'Pabrik dengan proses produksi, gudang bahan baku, dan kontrol kualitas yang masih manual.', [
                'Data produksi tersebar di Excel dan kertas',
                'Stok bahan baku sering tidak sinkron dengan gudang',
                'Laporan ke manajemen terlambat berhari-hari',
            ]],
            ['Distribusi & Logistik', 'truck', 'Distributor dan perusahaan logistik dengan banyak gudang, armada, dan tim lapangan.', [
                'Pengiriman sulit dilacak secara real-time',
                'Rute armada belum optimal',
                'Rekap order dari sales lapangan masih manual',
            ]],
            ['Konstruksi', 'hard-hat', 'Kontraktor dan pengembang dengan banyak proyek berjalan bersamaan.', [
                'Progres proyek sulit dipantau dari kantor pusat',
                'Pengadaan material sering terlambat',
                'Biaya proyek membengkak tanpa terdeteksi dini',
            ]],
            ['Ritel', 'store', 'Jaringan toko dan bisnis ritel dengan transaksi harian yang tinggi.', [
                'Stok antar cabang tidak terlihat',
                'Program loyalitas pelanggan belum terukur',
                'Penjualan online dan offline belum terintegrasi',
            ]],
            ['Kesehatan', 'stethoscope', 'Klinik, rumah sakit, dan laboratorium yang butuh layanan cepat dan data akurat.', [
                'Antrean pasien panjang',
                'Rekam medis masih kertas',
                'Klaim asuransi lambat diproses',
            ]],
            ['Pendidikan', 'graduation-cap', 'Sekolah, kampus, dan lembaga pelatihan yang ingin layanan akademik lebih efisien.', [
                'Administrasi siswa memakan waktu',
                'Pembelajaran daring belum terstruktur',
                'Komunikasi dengan orang tua tidak terpusat',
            ]],
        ])->map(fn (array $industry, int $index): Industry => Industry::query()->updateOrCreate(
            ['slug' => Str::slug($industry[0])],
            [
                'name' => $industry[0],
                'icon' => $industry[1],
                'summary' => $industry[2],
                'pain_points' => $industry[3],
                'sort_order' => $index,
                'published_at' => now(),
            ],
        ));

        $services = collect([
            [ServicePillar::Consulting, 'Konsultasi & Assessment Digital', 'search-check', 'Belum tahu teknologi apa yang tepat untuk bisnis Anda?',
                'Kami memetakan proses bisnis, sistem yang sudah ada, dan kebutuhan tim sebelum merekomendasikan solusi.',
                ['Laporan assessment proses bisnis', 'Rekomendasi solusi dan prioritas', 'Roadmap, estimasi biaya, dan waktu']],
            [ServicePillar::Consulting, 'Strategi Transformasi Digital', 'compass', 'Ingin digitalisasi, tapi takut salah langkah dan boros biaya?',
                'Kami menyusun strategi bertahap yang realistis sesuai kesiapan tim dan anggaran perusahaan.',
                ['Peta jalan transformasi 12–24 bulan', 'Analisis kesiapan tim dan sistem', 'Rencana manajemen perubahan']],
            [ServicePillar::Design, 'Desain Alur & UI/UX Aplikasi', 'pen-tool', 'Aplikasi yang tidak dipakai tim adalah investasi yang sia-sia.',
                'Alur dan tampilan aplikasi kami validasi bersama pengguna Anda sebelum mulai dibangun.',
                ['Pemetaan alur pengguna', 'Prototipe interaktif', 'Uji coba dengan pengguna']],
            [ServicePillar::Development, 'Pengembangan Aplikasi Web & Mobile', 'code', 'Butuh aplikasi yang benar-benar sesuai proses bisnis Anda?',
                'Kami membangun aplikasi custom secara iteratif dengan demo berkala, sehingga Anda selalu tahu progresnya.',
                ['Aplikasi web dan mobile', 'Integrasi dengan sistem yang sudah ada', 'Dokumentasi teknis']],
            [ServicePillar::Development, 'Integrasi Sistem & Otomasi', 'workflow', 'Data di banyak sistem yang tidak saling terhubung?',
                'Kami menghubungkan ERP, akuntansi, dan aplikasi operasional agar data mengalir otomatis.',
                ['Integrasi API antar sistem', 'Otomasi laporan', 'Dashboard data terpusat']],
            [ServicePillar::Support, 'Implementasi, Training & Pendampingan', 'life-buoy', 'Aplikasi sudah jadi, tapi tim belum siap memakainya?',
                'Kami mendampingi go-live, migrasi data, pelatihan pengguna, sampai support dan pengembangan lanjutan.',
                ['Migrasi data', 'Pelatihan pengguna', 'Support dan maintenance berkala']],
        ])->map(fn (array $service, int $index): Service => Service::query()->updateOrCreate(
            ['slug' => Str::slug($service[1])],
            [
                'pillar' => $service[0],
                'name' => $service[1],
                'icon' => $service[2],
                'headline' => $service[3],
                'problem_statement' => $service[4],
                'body' => $service[4],
                'capabilities' => collect($service[5])
                    ->map(fn (string $title): array => ['title' => $title, 'description' => null])
                    ->all(),
                'methodology' => [
                    ['title' => 'Pahami kebutuhan', 'description' => 'Diskusi dan pemetaan masalah bersama tim klien.'],
                    ['title' => 'Rancang solusi', 'description' => 'Rekomendasi, prioritas, dan rencana kerja yang disetujui bersama.'],
                    ['title' => 'Eksekusi bertahap', 'description' => 'Pekerjaan dibagi per tahap dengan demo dan evaluasi berkala.'],
                    ['title' => 'Serah terima & dampingi', 'description' => 'Dokumentasi, pelatihan, dan pendampingan setelah selesai.'],
                ],
                'sort_order' => $index,
                'published_at' => now(),
            ],
        ));

        $caseStudies = [
            [
                'industry' => 'manufaktur',
                'services' => [0, 3, 5],
                'title' => 'Digitalisasi Pencatatan Produksi Pabrik Komponen Otomotif',
                'client_name' => 'Produsen Komponen Otomotif',
                'project_period' => '2024 - 2025',
                'organization_type' => OrganizationType::Corporate,
                'key_insights' => [
                    ['title' => 'Digitalisasi dimulai dari standar data', 'description' => 'Tanpa kode barang yang seragam, aplikasi apa pun akan menghasilkan laporan yang berbeda-beda.'],
                    ['title' => 'Libatkan operator sejak desain', 'description' => 'Adopsi tinggi karena alur input dirancang bersama orang yang memakainya setiap hari.'],
                ],
                'excerpt' => 'Dari laporan produksi berbasis kertas menjadi dashboard real-time untuk manajemen.',
                'challenge' => 'Data produksi dicatat di kertas lalu diketik ulang ke Excel. Laporan ke manajemen terlambat 3–5 hari dan sering berbeda dengan kondisi gudang.',
                'assessment' => 'Kami memetakan 4 lini produksi dan menemukan 3 titik input ganda serta tidak adanya standar kode barang antar gudang.',
                'recommendation' => 'Standarisasi kode barang, aplikasi input produksi berbasis tablet di lantai pabrik, dan dashboard terpusat untuk manajemen.',
                'solution' => 'Aplikasi web produksi dan gudang terintegrasi, dipakai oleh 60 operator, dengan dashboard harian untuk direksi.',
                'results' => [['label' => 'Waktu laporan', 'value' => '5 hari → real-time'], ['label' => 'Selisih stok', 'value' => '-82%'], ['label' => 'Pengguna aktif', 'value' => '60 operator']],
                'is_featured' => true,
            ],
            [
                'industry' => 'distribusi-logistik',
                'services' => [0, 4],
                'title' => 'Pelacakan Pengiriman dan Order Sales Lapangan Distributor FMCG',
                'client_name' => 'Distributor FMCG Regional',
                'project_period' => '2025 - Sekarang',
                'organization_type' => OrganizationType::Corporate,
                'key_insights' => [
                    ['title' => 'Integrasi lebih murah dari ganti sistem', 'description' => 'Sistem akuntansi lama tetap dipakai, cukup dihubungkan dengan aplikasi baru.'],
                ],
                'excerpt' => 'Order dari sales lapangan langsung masuk sistem dan pengiriman bisa dilacak pelanggan.',
                'challenge' => 'Sales mengirim order lewat chat, admin merekap manual, dan pelanggan sering menanyakan status pengiriman.',
                'assessment' => 'Sekitar 30% waktu admin habis untuk rekap order dan menjawab pertanyaan status pengiriman.',
                'recommendation' => 'Aplikasi order mobile untuk sales, integrasi ke sistem akuntansi yang sudah ada, dan halaman lacak pengiriman.',
                'solution' => 'Aplikasi mobile sales order dan portal pelacakan pengiriman yang terhubung ke sistem akuntansi.',
                'results' => [['label' => 'Waktu rekap order', 'value' => '-70%'], ['label' => 'Komplain status kirim', 'value' => '-65%']],
                'is_featured' => true,
            ],
            [
                'industry' => 'konstruksi',
                'services' => [1, 2, 3],
                'title' => 'Monitoring Progres dan Biaya Proyek Kontraktor Gedung',
                'client_name' => 'Kontraktor Bangunan Gedung',
                'project_period' => '2023 - 2024',
                'organization_type' => OrganizationType::Sme,
                'key_insights' => [
                    ['title' => 'Peringatan dini lebih berharga dari laporan lengkap', 'description' => 'Manajemen butuh tahu masalah lebih awal, bukan laporan tebal di akhir bulan.'],
                ],
                'excerpt' => 'Manajemen bisa memantau progres dan biaya 12 proyek dari satu dashboard.',
                'challenge' => 'Laporan progres proyek dikirim mingguan dalam format berbeda-beda, sehingga pembengkakan biaya terlambat diketahui.',
                'assessment' => 'Tidak ada format laporan standar dan data pengadaan material terpisah dari data progres.',
                'recommendation' => 'Format laporan harian standar via aplikasi, integrasi data pengadaan, dan peringatan otomatis saat biaya melewati anggaran.',
                'solution' => 'Aplikasi laporan harian proyek dan dashboard biaya dengan peringatan otomatis.',
                'results' => [['label' => 'Proyek terpantau', 'value' => '12 proyek'], ['label' => 'Deteksi overbudget', 'value' => '2 minggu lebih cepat']],
                'is_featured' => true,
            ],
        ];

        foreach ($caseStudies as $index => $data) {
            $caseStudy = CaseStudy::query()->updateOrCreate(
                ['slug' => Str::slug($data['title'])],
                [
                    'industry_id' => $industries->firstWhere('slug', $data['industry'])?->id,
                    'title' => $data['title'],
                    'client_name' => $data['client_name'],
                    'project_period' => $data['project_period'],
                    'organization_type' => $data['organization_type'],
                    'key_insights' => $data['key_insights'],
                    'excerpt' => $data['excerpt'],
                    'challenge' => $data['challenge'],
                    'assessment' => $data['assessment'],
                    'recommendation' => $data['recommendation'],
                    'solution' => $data['solution'],
                    'results' => $data['results'],
                    'is_featured' => $data['is_featured'],
                    'sort_order' => $index,
                    'published_at' => now(),
                ],
            );

            $caseStudy->services()->sync(
                collect($data['services'])->map(fn (int $serviceIndex): int => $services[$serviceIndex]->id),
            );
        }

        collect([
            [2018, 'Perusahaan berdiri', 'Dimulai sebagai tim kecil yang membantu digitalisasi UMKM manufaktur.'],
            [2020, 'Fokus menjadi konsultan teknologi', 'Menambahkan layanan assessment dan pendampingan, bukan hanya pengembangan aplikasi.'],
            [2023, '50 proyek transformasi digital', 'Mendampingi klien dari manufaktur, distribusi, hingga konstruksi.'],
            [2025, 'Membuka kantor cabang', 'Memperluas jangkauan untuk mendampingi klien di luar Jabodetabek.'],
        ])->each(fn (array $milestone): CompanyMilestone => CompanyMilestone::query()->updateOrCreate(
            ['year' => $milestone[0], 'title' => $milestone[1]],
            ['description' => $milestone[2]],
        ));

        Office::query()->updateOrCreate(
            ['name' => 'Kantor Pusat'],
            [
                'type' => OfficeType::Head,
                'address' => config('company.contact.address'),
                'city' => 'Jakarta',
                'phone' => config('company.contact.phone'),
                'email' => config('company.contact.email'),
                'sort_order' => 0,
                'is_active' => true,
            ],
        );

        collect([
            [
                'title' => '5 Tanda Perusahaan Anda Siap Digitalisasi',
                'category' => 'Strategi',
                'excerpt' => 'Sebelum membeli aplikasi, pastikan lima hal ini sudah ada di perusahaan Anda.',
                'services' => [0, 1],
            ],
            [
                'title' => 'Kenapa Integrasi Sistem Lebih Penting dari Aplikasi Baru',
                'category' => 'Teknologi',
                'excerpt' => 'Banyak perusahaan menambah aplikasi baru, padahal masalahnya ada di data yang tidak terhubung.',
                'services' => [4],
            ],
        ])->each(function (array $data) use ($services): void {
            $article = Article::query()->updateOrCreate(
                ['slug' => Str::slug($data['title'])],
                [
                    'title' => $data['title'],
                    'category' => $data['category'],
                    'excerpt' => $data['excerpt'],
                    'body' => $data['excerpt']."\n\nArtikel contoh. Ganti dengan tulisan tim Anda dari panel admin.",
                    'published_at' => now(),
                ],
            );

            $article->services()->sync(
                collect($data['services'])->map(fn (int $serviceIndex): int => $services[$serviceIndex]->id),
            );
        });

        collect([
            [BusinessFunction::Operations, 'Digitalisasi Produksi & Gudang', 'factory', 'Stok dan data produksi tidak pernah sinkron?'],
            [BusinessFunction::Sales, 'Sistem Order & Sales Lapangan', 'truck', 'Order dari sales masih lewat chat dan direkap manual?'],
            [BusinessFunction::Finance, 'Otomasi Penagihan & Laporan Keuangan', 'landmark', 'Tagihan terlambat karena data order tidak terhubung?'],
            [BusinessFunction::HumanResource, 'Sistem Absensi & Kinerja Karyawan', 'building', 'Rekap absensi dan penilaian kinerja masih di spreadsheet?'],
            [BusinessFunction::InformationTechnology, 'Integrasi & Modernisasi Sistem', 'workflow', 'Banyak aplikasi tapi datanya tidak saling terhubung?'],
        ])->each(fn (array $solution, int $index): Solution => Solution::query()->updateOrCreate(
            ['slug' => Str::slug($solution[1])],
            [
                'business_function' => $solution[0],
                'name' => $solution[1],
                'icon' => $solution[2],
                'headline' => $solution[3],
                'features' => [],
                'sort_order' => $index,
                'published_at' => now(),
            ],
        ));

        collect([
            ['Apakah konsultasi awal benar-benar gratis?', 'Ya. Konsultasi awal gratis dan tanpa komitmen. Tujuannya memahami masalah bisnis Anda dan menentukan langkah berikutnya.'],
            ['Berapa lama sampai aplikasi bisa dipakai?', 'Tergantung cakupan. Setelah assessment, Anda menerima roadmap dengan estimasi waktu per tahap sebelum pengembangan dimulai.'],
            ['Apakah sistem lama kami harus diganti?', 'Tidak selalu. Kami mengutamakan integrasi dengan sistem yang sudah berjalan bila itu lebih efisien.'],
        ])->each(fn (array $faq, int $index): Faq => Faq::query()->updateOrCreate(
            ['page' => 'how-we-work', 'question' => $faq[0]],
            ['answer' => $faq[1], 'sort_order' => $index, 'is_active' => true],
        ));
    }
}
