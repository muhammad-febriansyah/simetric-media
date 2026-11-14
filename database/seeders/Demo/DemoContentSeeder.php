<?php

namespace Database\Seeders\Demo;

use App\Enums\BusinessFunction;
use App\Enums\OrganizationType;
use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\Faq;
use App\Models\Industry;
use App\Models\Service;
use App\Models\Solution;
use App\Models\User;
use Database\Seeders\ExpertiseSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * 20 realistic demo records each for industries, services, solutions, case studies,
 * articles and FAQs. All companies and stories are fictional.
 */
class DemoContentSeeder extends Seeder
{
    public function run(): void
    {
        $industries = $this->industries();
        $services = $this->services();
        $solutions = $this->solutions();
        $this->caseStudies($industries, $services, $solutions);
        $this->articles($services);
        $this->faqs($services);
    }

    /**
     * @return Collection<int, Industry>
     */
    private function industries(): Collection
    {
        $rows = [
            ['Manufaktur', 'factory', 'Pabrik dengan lini produksi, gudang bahan baku, dan kontrol kualitas yang masih manual.', ['Data produksi tersebar di Excel dan kertas', 'Stok bahan baku tidak sinkron dengan gudang', 'Laporan ke manajemen terlambat berhari-hari']],
            ['Distribusi & Logistik', 'truck', 'Distributor dan perusahaan logistik dengan banyak gudang, armada, dan tim lapangan.', ['Pengiriman sulit dilacak secara real-time', 'Rute armada belum optimal', 'Order dari sales lapangan direkap manual']],
            ['Konstruksi', 'hard-hat', 'Kontraktor dan pengembang dengan banyak proyek berjalan bersamaan.', ['Progres proyek sulit dipantau dari kantor pusat', 'Pengadaan material sering terlambat', 'Pembengkakan biaya terlambat terdeteksi']],
            ['Ritel', 'store', 'Jaringan toko dengan transaksi harian tinggi di banyak cabang.', ['Stok antar cabang tidak terlihat', 'Promo sulit diukur dampaknya', 'Penjualan online dan offline belum terhubung']],
            ['Kesehatan', 'stethoscope', 'Klinik, rumah sakit, dan laboratorium yang butuh layanan cepat dan data akurat.', ['Antrean pasien panjang', 'Rekam medis masih kertas', 'Klaim asuransi lambat diproses']],
            ['Pendidikan', 'graduation-cap', 'Sekolah, kampus, dan lembaga pelatihan.', ['Administrasi siswa memakan waktu', 'Pembelajaran daring belum terstruktur', 'Komunikasi dengan orang tua tidak terpusat']],
            ['Perbankan & Keuangan', 'landmark', 'Koperasi, BPR, leasing, dan lembaga keuangan non-bank.', ['Proses persetujuan kredit lama', 'Data nasabah tersebar di banyak sistem', 'Pelaporan regulasi masih manual']],
            ['Asuransi', 'landmark', 'Perusahaan asuransi dan broker yang melayani banyak polis.', ['Klaim diproses lewat email dan berkas fisik', 'Status polis sulit dicek nasabah', 'Agen lapangan tidak punya data terkini']],
            ['Pertambangan', 'pickaxe', 'Perusahaan tambang dan kontraktor alat berat.', ['Jam operasi alat berat tidak tercatat akurat', 'Perawatan alat masih reaktif', 'Laporan produksi harian terlambat']],
            ['Energi & Migas', 'zap', 'Perusahaan energi, migas, dan penyedia jasa pendukungnya.', ['Inspeksi aset dicatat di kertas', 'Izin kerja diproses manual', 'Data keselamatan kerja tidak terpusat']],
            ['Agribisnis & Perkebunan', 'tractor', 'Perkebunan, peternakan, dan pengolahan hasil pertanian.', ['Data panen per blok tidak real-time', 'Upah harian dihitung manual', 'Rantai pasok sulit ditelusuri']],
            ['Perikanan', 'tractor', 'Budidaya, pengolahan, dan ekspor hasil perikanan.', ['Kualitas air kolam dicatat manual', 'Traceability ekspor belum digital', 'Stok cold storage tidak akurat']],
            ['Properti', 'building', 'Pengembang dan pengelola properti residensial maupun komersial.', ['Data unit dan pembeli tersebar', 'Penagihan cicilan dan IPL manual', 'Keluhan penghuni lambat ditangani']],
            ['Perhotelan & Pariwisata', 'building', 'Hotel, resort, dan biro perjalanan.', ['Reservasi dari banyak kanal tidak sinkron', 'Data tamu tidak dimanfaatkan', 'Laporan okupansi terlambat']],
            ['Makanan & Minuman', 'store', 'Produsen makanan, jaringan restoran, dan kafe.', ['Resep dan HPP belum terstandar', 'Stok bahan baku cepat kedaluwarsa', 'Penjualan per outlet sulit dibandingkan']],
            ['Otomotif', 'factory', 'Dealer, bengkel, dan produsen komponen otomotif.', ['Jadwal servis tidak terkelola', 'Stok suku cadang tidak akurat', 'Data pelanggan tidak ditindaklanjuti']],
            ['Telekomunikasi', 'workflow', 'Penyedia internet, menara, dan jasa jaringan.', ['Tiket gangguan menumpuk', 'Teknisi lapangan sulit dikoordinasi', 'Aset jaringan tidak terdokumentasi']],
            ['Transportasi', 'truck', 'Operator bus, travel, dan penyewaan kendaraan.', ['Jadwal armada bentrok', 'Biaya BBM tidak terkontrol', 'Pemesanan tiket masih manual']],
            ['Pemerintahan', 'landmark', 'Instansi pemerintah daerah dan BUMD.', ['Layanan publik masih tatap muka', 'Data antar dinas tidak terhubung', 'Pelaporan kinerja manual']],
            ['Nirlaba', 'life-buoy', 'Yayasan, LSM, dan lembaga filantropi.', ['Data donatur tidak terkelola', 'Laporan program sulit disusun', 'Penyaluran bantuan sulit dilacak']],
        ];

        return collect($rows)->map(fn (array $row, int $index): Industry => Industry::query()->updateOrCreate(
            ['slug' => Str::slug($row[0])],
            [
                'name' => $row[0],
                'icon' => $row[1],
                'summary' => $row[2],
                'pain_points' => $row[3],
                'sort_order' => $index,
                'published_at' => now(),
            ],
        ));
    }

    /**
     * @return Collection<int, Service>
     */
    private function services(): Collection
    {
        $methodology = [
            'consulting' => [
                ['title' => 'Wawancara & observasi', 'description' => 'Kami bertemu tiap divisi dan melihat langsung cara kerja di lapangan.'],
                ['title' => 'Pemetaan proses', 'description' => 'Alur kerja saat ini digambarkan, lengkap dengan titik masalahnya.'],
                ['title' => 'Analisis & prioritas', 'description' => 'Masalah diurutkan berdasarkan dampak bisnis dan kemudahan perbaikan.'],
                ['title' => 'Rekomendasi & roadmap', 'description' => 'Rencana bertahap dengan estimasi biaya dan waktu yang realistis.'],
            ],
            'design' => [
                ['title' => 'Riset pengguna', 'description' => 'Memahami siapa yang akan memakai aplikasi dan bagaimana mereka bekerja.'],
                ['title' => 'Alur & wireframe', 'description' => 'Merancang alur kerja yang paling sedikit langkahnya.'],
                ['title' => 'Prototipe interaktif', 'description' => 'Tampilan bisa dicoba sebelum satu baris kode ditulis.'],
                ['title' => 'Uji dengan pengguna', 'description' => 'Prototipe diuji langsung oleh calon pengguna lalu diperbaiki.'],
            ],
            'development' => [
                ['title' => 'Perencanaan sprint', 'description' => 'Fitur dibagi per sprint dua minggu sesuai prioritas.'],
                ['title' => 'Pengembangan iteratif', 'description' => 'Setiap sprint menghasilkan fitur yang bisa didemokan.'],
                ['title' => 'Pengujian', 'description' => 'Pengujian otomatis dan uji terima oleh tim klien.'],
                ['title' => 'Rilis bertahap', 'description' => 'Aplikasi dirilis bertahap agar risiko gangguan operasional kecil.'],
            ],
            'support' => [
                ['title' => 'Persiapan go-live', 'description' => 'Checklist kesiapan data, pengguna, dan infrastruktur.'],
                ['title' => 'Pelatihan', 'description' => 'Pelatihan per peran, lengkap dengan modul dan video.'],
                ['title' => 'Pendampingan', 'description' => 'Tim kami siaga di minggu-minggu pertama pemakaian.'],
                ['title' => 'Evaluasi berkala', 'description' => 'Laporan pemakaian dan rekomendasi perbaikan tiap bulan.'],
            ],
        ];

        $rows = [
            ['consulting', 'Konsultasi & Assessment Digital', 'search-check', 'Belum tahu teknologi apa yang tepat untuk bisnis Anda?'],
            ['consulting', 'Strategi Transformasi Digital', 'compass', 'Ingin digitalisasi, tapi takut salah langkah dan boros biaya?'],
            ['consulting', 'Audit Sistem & Infrastruktur IT', 'search-check', 'Sistem lama lambat dan sering bermasalah?'],
            ['consulting', 'Konsultasi Data & Pelaporan', 'compass', 'Data banyak, tapi keputusan masih berdasarkan perkiraan?'],
            ['consulting', 'Pendampingan Pengadaan Software', 'briefcase', 'Bingung memilih vendor atau aplikasi siap pakai?'],
            ['design', 'Desain Alur & UI/UX Aplikasi', 'pen-tool', 'Aplikasi yang tidak dipakai tim adalah investasi yang sia-sia.'],
            ['design', 'Desain Ulang Aplikasi Lama', 'pen-tool', 'Aplikasi sudah ada, tapi karyawan enggan memakainya?'],
            ['design', 'Riset & Pengujian Pengguna', 'search-check', 'Belum yakin fitur mana yang benar-benar dibutuhkan?'],
            ['design', 'Design System Perusahaan', 'pen-tool', 'Tampilan aplikasi internal berbeda-beda dan membingungkan?'],
            ['design', 'Prototipe Cepat untuk Validasi Ide', 'pen-tool', 'Ingin menguji ide sebelum mengeluarkan biaya besar?'],
            ['development', 'Pengembangan Aplikasi Web & Mobile', 'code', 'Butuh aplikasi yang benar-benar sesuai proses bisnis Anda?'],
            ['development', 'Integrasi Sistem & Otomasi', 'workflow', 'Data di banyak sistem yang tidak saling terhubung?'],
            ['development', 'Dashboard & Business Intelligence', 'code', 'Laporan manajemen masih dirangkum manual setiap minggu?'],
            ['development', 'Aplikasi Lapangan Offline-First', 'code', 'Tim lapangan sering bekerja di area tanpa sinyal?'],
            ['development', 'Modernisasi Aplikasi Legacy', 'workflow', 'Aplikasi lama sulit dikembangkan dan dirawat?'],
            ['support', 'Implementasi, Training & Pendampingan', 'life-buoy', 'Aplikasi sudah jadi, tapi tim belum siap memakainya?'],
            ['support', 'Migrasi Data', 'workflow', 'Data lama berantakan dan takut hilang saat pindah sistem?'],
            ['support', 'Maintenance & Support Aplikasi', 'life-buoy', 'Aplikasi sering error dan vendor lama sulit dihubungi?'],
            ['support', 'Managed Cloud & Keamanan', 'zap', 'Khawatir server down atau data bocor?'],
            ['support', 'Manajemen Perubahan Organisasi', 'life-buoy', 'Karyawan menolak cara kerja baru?'],
        ];

        $expertiseIds = ExpertiseSeeder::ids();

        return collect($rows)->map(function (array $row, int $index) use ($methodology, $expertiseIds): Service {
            [$pillar, $name, $icon, $headline] = $row;

            return Service::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'expertise_id' => $expertiseIds[$pillar],
                    'name' => $name,
                    'icon' => $icon,
                    'headline' => $headline,
                    'problem_statement' => "{$headline} Kami mulai dengan memahami cara kerja tim Anda, lalu merancang solusi yang paling masuk akal untuk kondisi perusahaan.",
                    'body' => "Layanan {$name} dirancang untuk perusahaan yang ingin hasil nyata, bukan sekadar aplikasi. Setiap keputusan teknis kami jelaskan dalam bahasa bisnis, sehingga manajemen bisa menilai manfaat dan biayanya dengan jelas.\n\nTim kami terdiri dari konsultan bisnis, desainer, dan engineer yang terbiasa bekerja di lingkungan industri: pabrik, gudang, proyek konstruksi, hingga kantor cabang.",
                    'capabilities' => [
                        ['title' => 'Analisis kebutuhan', 'description' => "Memetakan kebutuhan {$name} bersama tim inti klien."],
                        ['title' => 'Rencana kerja terukur', 'description' => 'Target, tahapan, dan indikator keberhasilan disepakati sejak awal.'],
                        ['title' => 'Laporan berkala', 'description' => 'Progres dilaporkan setiap minggu dalam format yang mudah dibaca manajemen.'],
                    ],
                    'methodology' => $methodology[$pillar],
                    'sort_order' => $index,
                    'published_at' => now(),
                ],
            );
        });
    }

    /**
     * @return Collection<int, Solution>
     */
    private function solutions(): Collection
    {
        $rows = [
            [BusinessFunction::Operations, 'Digitalisasi Produksi & Gudang', 'factory', 'Stok dan data produksi tidak pernah sinkron?'],
            [BusinessFunction::Operations, 'Manajemen Aset & Perawatan Alat', 'hard-hat', 'Mesin rusak mendadak karena perawatan tidak terjadwal?'],
            [BusinessFunction::Operations, 'Monitoring Proyek Lapangan', 'hard-hat', 'Progres proyek baru diketahui saat rapat mingguan?'],
            [BusinessFunction::Operations, 'Manajemen Armada & Pengiriman', 'truck', 'Pengiriman sering terlambat dan sulit dilacak?'],
            [BusinessFunction::Sales, 'Sistem Order & Sales Lapangan', 'truck', 'Order dari sales masih lewat chat dan direkap manual?'],
            [BusinessFunction::Sales, 'CRM & Pipeline Penjualan', 'briefcase', 'Prospek hilang karena tidak ada yang menindaklanjuti?'],
            [BusinessFunction::Sales, 'Portal Pelanggan B2B', 'store', 'Pelanggan terus menanyakan status order dan tagihan?'],
            [BusinessFunction::Sales, 'Program Loyalitas Pelanggan', 'store', 'Pelanggan lama jarang kembali berbelanja?'],
            [BusinessFunction::Finance, 'Otomasi Penagihan & Piutang', 'landmark', 'Tagihan terlambat karena data order tidak terhubung?'],
            [BusinessFunction::Finance, 'Pengajuan & Persetujuan Anggaran', 'landmark', 'Persetujuan biaya berputar-putar lewat email?'],
            [BusinessFunction::Finance, 'Rekonsiliasi Bank Otomatis', 'landmark', 'Tim keuangan lembur setiap akhir bulan?'],
            [BusinessFunction::Finance, 'Dashboard Keuangan Manajemen', 'compass', 'Direksi menunggu laporan keuangan berminggu-minggu?'],
            [BusinessFunction::HumanResource, 'Sistem Absensi & Kinerja Karyawan', 'building', 'Rekap absensi dan penilaian kinerja masih di spreadsheet?'],
            [BusinessFunction::HumanResource, 'Rekrutmen & Onboarding Digital', 'building', 'Proses rekrutmen lama dan berkas kandidat tercecer?'],
            [BusinessFunction::HumanResource, 'Payroll & Lembur Terintegrasi', 'building', 'Perhitungan gaji dan lembur sering salah?'],
            [BusinessFunction::HumanResource, 'Learning Management Internal', 'graduation-cap', 'Pelatihan karyawan tidak terdokumentasi?'],
            [BusinessFunction::InformationTechnology, 'Integrasi & Modernisasi Sistem', 'workflow', 'Banyak aplikasi tapi datanya tidak saling terhubung?'],
            [BusinessFunction::InformationTechnology, 'Helpdesk & Manajemen Tiket IT', 'life-buoy', 'Permintaan bantuan IT menumpuk tanpa prioritas?'],
            [BusinessFunction::InformationTechnology, 'Single Sign-On & Hak Akses', 'zap', 'Karyawan punya terlalu banyak akun dan password?'],
            [BusinessFunction::InformationTechnology, 'Backup & Disaster Recovery', 'zap', 'Belum punya rencana jika server utama mati?'],
        ];

        return collect($rows)->map(fn (array $row, int $index): Solution => Solution::query()->updateOrCreate(
            ['slug' => Str::slug($row[1])],
            [
                'business_function' => $row[0],
                'name' => $row[1],
                'icon' => $row[2],
                'headline' => $row[3],
                'problem_statement' => $row[3].' Solusi ini membantu tim '.mb_strtolower($row[0]->label()).' bekerja lebih cepat dengan data yang bisa dipercaya.',
                'body' => "Kami tidak menjual aplikasi jadi. Solusi {$row[1]} dirancang setelah memahami alur kerja Anda, lalu dibangun bertahap agar tim bisa beradaptasi.",
                'features' => [
                    ['title' => 'Data real-time', 'description' => 'Semua pihak melihat data yang sama pada saat yang sama.'],
                    ['title' => 'Persetujuan berjenjang', 'description' => 'Alur persetujuan mengikuti struktur organisasi Anda.'],
                    ['title' => 'Laporan otomatis', 'description' => 'Laporan harian dan bulanan tersusun tanpa rekap manual.'],
                ],
                'sort_order' => $index,
                'published_at' => now(),
            ],
        ));
    }

    /**
     * @param  Collection<int, Industry>  $industries
     * @param  Collection<int, Service>  $services
     * @param  Collection<int, Solution>  $solutions
     */
    private function caseStudies(Collection $industries, Collection $services, Collection $solutions): void
    {
        // [industry index, client description, focus, period, organization type, metrics, service indexes, solution indexes]
        $rows = [
            [0, 'Produsen Komponen Otomotif di Cikarang', 'pencatatan produksi dan gudang', '2024 - 2025', OrganizationType::Corporate, ['Waktu laporan' => '5 hari → real-time', 'Selisih stok' => '-82%', 'Operator aktif' => '60 orang'], [0, 10], [0]],
            [1, 'Distributor FMCG Jawa Timur', 'order sales lapangan dan pengiriman', '2025 - Sekarang', OrganizationType::Corporate, ['Waktu rekap order' => '-70%', 'Komplain status kirim' => '-65%', 'Sales aktif' => '120 orang'], [11, 13], [4, 3]],
            [2, 'Kontraktor Gedung Bertingkat di Jakarta', 'monitoring progres dan biaya proyek', '2023 - 2024', OrganizationType::Sme, ['Proyek terpantau' => '12 proyek', 'Deteksi overbudget' => '2 minggu lebih cepat', 'Laporan harian' => '100% digital'], [1, 5, 12], [2]],
            [3, 'Jaringan Toko Bahan Bangunan 40 Cabang', 'stok antar cabang', '2024 - 2025', OrganizationType::Corporate, ['Stok mati' => '-35%', 'Transfer antar cabang' => '3x lebih cepat', 'Cabang terhubung' => '40 cabang'], [10, 11], [0]],
            [4, 'Klinik Pratama dengan 8 Cabang', 'antrean dan rekam medis', '2025 - Sekarang', OrganizationType::Sme, ['Waktu tunggu pasien' => '-45%', 'Rekam medis digital' => '100%', 'Kepuasan pasien' => '4,7/5'], [5, 10], [17]],
            [5, 'Yayasan Pendidikan dengan 12 Sekolah', 'administrasi siswa dan komunikasi orang tua', '2024 - 2025', OrganizationType::Education, ['Waktu administrasi' => '-60%', 'Orang tua aktif di aplikasi' => '85%', 'Sekolah terhubung' => '12'], [0, 10, 15], [15]],
            [6, 'Koperasi Simpan Pinjam di Jawa Tengah', 'persetujuan kredit', '2023 - 2024', OrganizationType::NonProfit, ['Waktu persetujuan kredit' => '7 hari → 1 hari', 'Berkas fisik' => '-90%', 'Anggota terlayani' => '18.000'], [1, 10], [9]],
            [7, 'Broker Asuransi Nasional', 'pengajuan dan pelacakan klaim', '2025 - Sekarang', OrganizationType::Corporate, ['Waktu proses klaim' => '-50%', 'Klaim dilacak online' => '100%', 'Agen aktif' => '300 orang'], [10, 11], [6]],
            [8, 'Kontraktor Tambang Batu Bara di Kalimantan', 'jam operasi dan perawatan alat berat', '2024 - 2025', OrganizationType::Corporate, ['Downtime alat' => '-28%', 'Alat terpantau' => '210 unit', 'Laporan produksi' => 'H+0'], [13, 15], [1]],
            [9, 'Penyedia Jasa Pendukung Migas', 'inspeksi aset dan izin kerja', '2023 - 2024', OrganizationType::Corporate, ['Inspeksi digital' => '100%', 'Waktu izin kerja' => '-55%', 'Temuan K3 tertindaklanjuti' => '98%'], [13, 18], [1]],
            [10, 'Perkebunan Kelapa Sawit di Riau', 'pencatatan panen dan upah harian', '2024 - 2025', OrganizationType::Corporate, ['Data panen' => 'Harian per blok', 'Selisih upah' => '-95%', 'Mandor pengguna' => '85 orang'], [13, 16], [14]],
            [11, 'Eksportir Udang di Lampung', 'traceability produk ekspor', '2025 - Sekarang', OrganizationType::Sme, ['Dokumen ekspor' => '3x lebih cepat', 'Traceability' => '100% batch', 'Penolakan pembeli' => '0 kasus'], [0, 10], [0]],
            [12, 'Pengembang Perumahan di Tangerang', 'penagihan cicilan dan layanan penghuni', '2024 - 2025', OrganizationType::Corporate, ['Tunggakan' => '-40%', 'Keluhan selesai < 2 hari' => '92%', 'Unit terkelola' => '3.500'], [5, 10], [8]],
            [13, 'Grup Hotel Butik di Bali', 'reservasi multikanal', '2023 - 2024', OrganizationType::Sme, ['Overbooking' => '0 kasus', 'Okupansi' => '+12%', 'Laporan harian' => 'Otomatis'], [11, 12], [6]],
            [14, 'Jaringan Kafe dengan 25 Outlet', 'resep, HPP, dan stok bahan baku', '2024 - 2025', OrganizationType::Sme, ['Bahan terbuang' => '-30%', 'HPP terstandar' => '100% menu', 'Outlet terhubung' => '25'], [0, 12], [0, 11]],
            [15, 'Dealer & Bengkel Resmi Kendaraan Niaga', 'jadwal servis dan suku cadang', '2025 - Sekarang', OrganizationType::Corporate, ['Servis berulang' => '+22%', 'Stok suku cadang akurat' => '97%', 'Waktu servis' => '-25%'], [10, 15], [5]],
            [16, 'Penyedia Internet Regional', 'tiket gangguan dan teknisi lapangan', '2024 - 2025', OrganizationType::Corporate, ['Waktu penyelesaian gangguan' => '-48%', 'Teknisi terkoordinasi' => '150 orang', 'Kepuasan pelanggan' => '+18%'], [11, 13], [17]],
            [17, 'Operator Bus Antarkota', 'jadwal armada dan pemesanan tiket', '2023 - 2024', OrganizationType::Sme, ['Penjualan tiket online' => '65%', 'Biaya BBM' => '-12%', 'Armada terjadwal' => '90 bus'], [10, 11], [3]],
            [18, 'Dinas Pelayanan Perizinan Kabupaten', 'layanan perizinan online', '2024 - 2025', OrganizationType::Government, ['Izin terbit' => '14 hari → 3 hari', 'Layanan online' => '100%', 'Kepuasan masyarakat' => '4,6/5'], [1, 5, 15], [16]],
            [19, 'Yayasan Kemanusiaan Nasional', 'data donatur dan penyaluran bantuan', '2025 - Sekarang', OrganizationType::NonProfit, ['Donatur aktif' => '+35%', 'Laporan program' => 'Otomatis', 'Penyaluran terlacak' => '100%'], [3, 12], [11]],
        ];

        foreach ($rows as $index => [$industryIndex, $client, $focus, $period, $organizationType, $metrics, $serviceIndexes, $solutionIndexes]) {
            $industry = $industries[$industryIndex];
            $title = "Digitalisasi {$focus} untuk {$client}";
            $slug = Str::slug($title);

            $caseStudy = CaseStudy::query()->updateOrCreate(['slug' => $slug], [
                'industry_id' => $industry->id,
                'title' => $title,
                'client_name' => $client,
                'project_period' => $period,
                'organization_type' => $organizationType,
                'excerpt' => "Bagaimana {$client} membenahi {$focus} lewat pendampingan konsultasi dari assessment sampai implementasi.",
                'cover_image' => DemoImages::photo('case-'.$slug, 'case-studies'),
                'challenge' => "{$client} menghadapi masalah klasik di {$focus}: data dicatat di banyak tempat, laporan terlambat, dan manajemen sulit mengambil keputusan cepat. Upaya membeli aplikasi siap pakai sebelumnya gagal karena tidak sesuai cara kerja tim.",
                'assessment' => 'Selama tiga minggu kami memetakan alur kerja bersama tim inti. Temuan utamanya: ada input ganda di beberapa titik, tidak ada standar data antar unit, dan sebagian besar keputusan menunggu rekap manual.',
                'recommendation' => 'Kami merekomendasikan standarisasi data terlebih dahulu, lalu aplikasi bertahap: modul paling berdampak dikerjakan pertama, disusul integrasi dengan sistem yang sudah ada.',
                'solution' => "Aplikasi {$focus} terintegrasi yang dipakai harian oleh tim operasional, lengkap dengan dashboard untuk manajemen dan notifikasi otomatis saat ada kendala.",
                'results' => collect($metrics)->map(fn (string $value, string $label): array => ['label' => $label, 'value' => $value])->values()->all(),
                'key_insights' => [
                    ['title' => 'Standar data lebih dulu, aplikasi kemudian', 'description' => 'Tanpa definisi data yang seragam, aplikasi apa pun akan menghasilkan laporan yang berbeda-beda.'],
                    ['title' => 'Libatkan pengguna sejak desain', 'description' => 'Adopsi tinggi karena alur kerja dirancang bersama orang yang memakainya setiap hari.'],
                ],
                'is_featured' => $index < 3,
                'sort_order' => $index,
                'meta_description' => Str::limit("Studi kasus {$focus} untuk {$client}.", 155, ''),
                'published_at' => now()->subDays(20 - $index),
            ]);

            $caseStudy->services()->sync(collect($serviceIndexes)->map(fn (int $i): int => $services[$i]->id));
            $caseStudy->solutions()->sync(collect($solutionIndexes)->map(fn (int $i): int => $solutions[$i]->id));

            if ($caseStudy->images()->doesntExist()) {
                $this->addGallery($caseStudy, $slug);
            }
        }

        // Case studies from ContentSeeder have no images yet.
        CaseStudy::query()->whereNull('cover_image')->get()->each(function (CaseStudy $caseStudy): void {
            $caseStudy->update(['cover_image' => DemoImages::photo('case-'.$caseStudy->slug, 'case-studies')]);

            if ($caseStudy->images()->doesntExist()) {
                $this->addGallery($caseStudy, $caseStudy->slug);
            }
        });
    }

    private function addGallery(CaseStudy $caseStudy, string $slug): void
    {
        foreach (range(1, 2) as $number) {
            $path = DemoImages::photo("gallery-{$slug}-{$number}", 'case-studies/gallery');

            if ($path) {
                $caseStudy->images()->create([
                    'path' => $path,
                    'caption' => $number === 1 ? 'Dashboard untuk manajemen' : 'Aplikasi dipakai tim di lapangan',
                    'sort_order' => $number,
                ]);
            }
        }
    }

    /**
     * @param  Collection<int, Service>  $services
     */
    private function articles(Collection $services): void
    {
        $rows = [
            ['5 Tanda Perusahaan Anda Siap Digitalisasi', 'Strategi'],
            ['Kenapa Integrasi Sistem Lebih Penting dari Aplikasi Baru', 'Teknologi'],
            ['Menghitung ROI Proyek Aplikasi Sebelum Memulai', 'Strategi'],
            ['Kesalahan Umum Saat Memilih Vendor Software', 'Strategi'],
            ['Cara Menyusun Roadmap Transformasi Digital yang Realistis', 'Strategi'],
            ['Mengapa Karyawan Menolak Aplikasi Baru dan Cara Mengatasinya', 'Operasional'],
            ['Standarisasi Data: Pondasi yang Sering Dilupakan', 'Teknologi'],
            ['Dashboard Manajemen yang Benar-Benar Dipakai Direksi', 'Teknologi'],
            ['Aplikasi Lapangan untuk Area Tanpa Sinyal', 'Teknologi'],
            ['Digitalisasi Gudang: Mulai dari Mana?', 'Operasional'],
            ['Mengukur Keberhasilan Proyek IT dengan KPI Bisnis', 'Strategi'],
            ['Build vs Buy: Kapan Membuat Aplikasi Sendiri?', 'Strategi'],
            ['Migrasi Data Tanpa Mengganggu Operasional', 'Teknologi'],
            ['Keamanan Data untuk Perusahaan Menengah', 'Teknologi'],
            ['Peran Konsultan dalam Proyek Digitalisasi', 'Strategi'],
            ['Otomasi Persetujuan: Memangkas Birokrasi Internal', 'Operasional'],
            ['Menyiapkan Tim Sebelum Go-Live Aplikasi', 'Operasional'],
            ['Cloud atau Server Sendiri? Pertimbangan untuk Perusahaan Industri', 'Teknologi'],
            ['Membaca Data Penjualan untuk Keputusan yang Lebih Cepat', 'Operasional'],
            ['Checklist Assessment Proses Bisnis Sebelum Membangun Aplikasi', 'Strategi'],
        ];

        $author = User::query()->where('is_admin', true)->orderBy('id')->first();

        foreach ($rows as $index => [$title, $category]) {
            $slug = Str::slug($title);
            $topic = Str::lower($title);

            $article = Article::query()->updateOrCreate(['slug' => $slug], [
                'author_id' => $author?->id,
                'title' => $title,
                'category' => $category,
                'excerpt' => "Panduan praktis tentang {$topic} untuk pemilik bisnis dan manajer yang tidak berlatar belakang teknologi.",
                'body' => implode("\n\n", [
                    "Banyak perusahaan industri ingin bergerak lebih cepat dengan teknologi, tetapi bingung harus mulai dari mana. Artikel ini membahas {$topic} dari sudut pandang bisnis, bukan teknis.",
                    'Langkah pertama selalu sama: pahami masalahnya dulu. Catat proses yang paling sering menimbulkan keterlambatan, kesalahan data, atau keluhan pelanggan. Dari situ, prioritas akan terlihat dengan sendirinya.',
                    'Berikutnya, libatkan orang yang menjalankan proses itu setiap hari. Merekalah yang tahu di mana waktu terbuang. Solusi yang dirancang tanpa mereka hampir selalu ditolak saat diterapkan.',
                    'Terakhir, ukur hasilnya dengan indikator bisnis: waktu proses, biaya, dan kepuasan pelanggan. Teknologi hanyalah alat; keberhasilannya dinilai dari perubahan cara kerja dan angka-angka tersebut.',
                ]),
                'cover_image' => DemoImages::photo('article-'.$slug, 'articles'),
                'meta_description' => Str::limit("Panduan {$topic} untuk perusahaan industri di Indonesia.", 155, ''),
                'published_at' => now()->subDays(($index * 5) + 1),
            ]);

            $article->services()->sync([$services[$index % $services->count()]->id]);
        }
    }

    /**
     * @param  Collection<int, Service>  $services
     */
    private function faqs(Collection $services): void
    {
        $rows = [
            ['page', 'how-we-work', 'Apakah konsultasi awal benar-benar gratis?', 'Ya. Konsultasi awal gratis dan tanpa komitmen. Tujuannya memahami masalah bisnis Anda dan menentukan langkah berikutnya.'],
            ['page', 'how-we-work', 'Berapa lama sampai aplikasi bisa dipakai?', 'Tergantung cakupan. Setelah assessment, Anda menerima roadmap dengan estimasi waktu per tahap sebelum pengembangan dimulai.'],
            ['page', 'how-we-work', 'Apakah sistem lama kami harus diganti?', 'Tidak selalu. Kami mengutamakan integrasi dengan sistem yang sudah berjalan bila itu lebih efisien.'],
            ['page', 'how-we-work', 'Bagaimana jika kebutuhan berubah di tengah proyek?', 'Perubahan dibahas di setiap akhir sprint. Dampaknya terhadap biaya dan waktu disampaikan terbuka sebelum dikerjakan.'],
            ['page', 'how-we-work', 'Siapa saja yang perlu terlibat dari pihak kami?', 'Satu penanggung jawab proyek dan perwakilan dari divisi yang prosesnya akan didigitalisasi.'],
            ['page', 'how-we-work', 'Apakah ada garansi setelah aplikasi live?', 'Ada masa garansi perbaikan bug, dilanjutkan paket support dan maintenance sesuai kebutuhan.'],
            ['page', 'how-we-work', 'Apakah source code menjadi milik kami?', 'Ya, untuk aplikasi yang dibangun khusus, source code dan dokumentasi diserahkan kepada klien.'],
            ['page', 'how-we-work', 'Bisakah dikerjakan bertahap sesuai anggaran?', 'Bisa. Roadmap kami susun per tahap sehingga setiap tahap sudah memberi manfaat sendiri.'],
            ['page', 'consultation', 'Informasi apa yang perlu disiapkan sebelum konsultasi?', 'Cukup gambaran masalah yang dihadapi dan proses yang terlibat. Dokumen pendukung boleh menyusul.'],
            ['page', 'consultation', 'Apakah konsultasi bisa dilakukan online?', 'Bisa, melalui video call. Untuk assessment, kami biasanya berkunjung ke lokasi.'],
            ['page', 'consultation', 'Berapa lama tim akan menghubungi saya?', 'Maksimal 1 hari kerja setelah formulir dikirim.'],
            ['page', 'consultation', 'Apakah data yang saya kirim aman?', 'Data hanya dipakai untuk keperluan konsultasi dan tidak dibagikan ke pihak lain.'],
            ['page', 'about', 'Sejak kapan perusahaan berdiri?', 'Kami mulai mendampingi perusahaan industri sejak 2018.'],
            ['page', 'about', 'Industri apa saja yang pernah ditangani?', 'Manufaktur, distribusi, konstruksi, ritel, kesehatan, pendidikan, keuangan, hingga instansi pemerintah.'],
            ['page', 'about', 'Apakah melayani klien di luar Jakarta?', 'Ya, kami mendampingi klien di berbagai kota di Indonesia.'],
            ['page', 'about', 'Apa bedanya dengan software house biasa?', 'Kami mulai dari masalah bisnis dan proses, bukan dari produk. Aplikasi adalah hasil akhir dari konsultasi.'],
            ['service', 0, 'Berapa lama proses assessment?', 'Umumnya 1 sampai 3 minggu, tergantung jumlah divisi dan lokasi.'],
            ['service', 5, 'Apakah desain bisa dicoba sebelum dibangun?', 'Bisa. Kami membuat prototipe interaktif yang bisa dicoba langsung oleh pengguna.'],
            ['service', 10, 'Teknologi apa yang dipakai?', 'Kami memilih teknologi yang umum dan mudah dirawat, sehingga Anda tidak bergantung pada satu vendor.'],
            ['service', 15, 'Apakah pelatihan disediakan untuk semua pengguna?', 'Ya, pelatihan per peran beserta modul dan video tutorial.'],
        ];

        foreach ($rows as $index => [$type, $target, $question, $answer]) {
            $placement = $type === 'page'
                ? ['page' => $target, 'faqable_type' => null, 'faqable_id' => null]
                : ['page' => null, 'faqable_type' => 'service', 'faqable_id' => $services[$target]->id];

            Faq::query()->updateOrCreate(
                [...$placement, 'question' => $question],
                ['answer' => $answer, 'sort_order' => $index, 'is_active' => true],
            );
        }
    }
}
