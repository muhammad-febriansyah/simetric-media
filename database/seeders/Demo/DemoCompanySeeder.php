<?php

namespace Database\Seeders\Demo;

use App\Enums\OfficeType;
use App\Models\CaseStudy;
use App\Models\ClientLogo;
use App\Models\CompanyMilestone;
use App\Models\Industry;
use App\Models\Office;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * 20 demo records each for team members, testimonials, client logos, milestones and offices.
 * All people and companies are fictional.
 */
class DemoCompanySeeder extends Seeder
{
    public function run(): void
    {
        $this->teamMembers();
        $this->testimonials();
        $this->clientLogos();
        $this->milestones();
        $this->offices();
    }

    private function teamMembers(): void
    {
        $rows = [
            ['Andreas Wibisono', 'Managing Director', 'Lebih dari 15 tahun memimpin proyek transformasi digital di sektor manufaktur dan distribusi.'],
            ['Ratna Kusumawardani', 'Head of Consulting', 'Spesialis pemetaan proses bisnis dengan latar belakang industrial engineering.'],
            ['Hendra Gunawan', 'Head of Engineering', 'Memimpin tim engineer yang membangun aplikasi operasional untuk lebih dari 40 klien.'],
            ['Dewi Anggraini', 'Head of Design', 'Merancang aplikasi yang mudah dipakai operator pabrik hingga direksi.'],
            ['Bayu Prasetyo', 'Senior Business Consultant', 'Berpengalaman di assessment rantai pasok dan pergudangan.'],
            ['Sinta Maharani', 'Business Consultant', 'Fokus pada digitalisasi proses keuangan dan persetujuan.'],
            ['Rizky Ramadhan', 'Lead Software Engineer', 'Arsitek integrasi sistem ERP dan aplikasi lapangan.'],
            ['Nadia Putri Lestari', 'Product Manager', 'Menjembatani kebutuhan bisnis klien dengan tim pengembang.'],
            ['Fajar Nugroho', 'Senior Backend Engineer', 'Membangun API dan integrasi data berskala besar.'],
            ['Larasati Wulandari', 'UI/UX Designer', 'Melakukan riset pengguna langsung di lokasi kerja klien.'],
            ['Arief Setiawan', 'Mobile Engineer', 'Spesialis aplikasi offline-first untuk tim lapangan.'],
            ['Maya Sari Dewi', 'Data Analyst', 'Merancang dashboard manajemen yang mudah dibaca.'],
            ['Yoga Pratama', 'DevOps Engineer', 'Menjaga infrastruktur cloud klien tetap aman dan stabil.'],
            ['Indah Permatasari', 'QA Engineer', 'Memastikan setiap rilis lolos uji fungsional dan uji terima.'],
            ['Galih Saputra', 'Frontend Engineer', 'Membangun antarmuka web yang cepat dan responsif.'],
            ['Citra Ayuningtyas', 'Implementation Specialist', 'Mendampingi klien saat go-live dan pelatihan pengguna.'],
            ['Dimas Aditya', 'Project Manager', 'Mengelola jadwal, risiko, dan komunikasi proyek dengan klien.'],
            ['Putri Handayani', 'Change Management Consultant', 'Membantu karyawan klien beradaptasi dengan cara kerja baru.'],
            ['Teguh Santoso', 'Support Engineer', 'Menangani tiket support dan maintenance aplikasi klien.'],
            ['Wulan Safitri', 'Business Development', 'Pintu pertama bagi calon klien yang ingin berkonsultasi.'],
        ];

        foreach ($rows as $index => [$name, $position, $bio]) {
            TeamMember::query()->updateOrCreate(['name' => $name], [
                'position' => $position,
                'bio' => $bio,
                'photo' => DemoImages::avatar('team-'.$name),
                'linkedin_url' => null,
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }

    private function testimonials(): void
    {
        $rows = [
            ['Budi Hartono', 'Direktur Operasional', 'Laporan produksi yang dulu butuh lima hari sekarang bisa kami lihat setiap pagi. Yang paling terasa, tim tidak lagi berdebat soal angka.'],
            ['Lina Wijayakusuma', 'Manajer Penjualan', 'Sales kami tidak perlu lagi rekap order di malam hari. Konsultannya benar-benar memahami cara kerja tim lapangan.'],
            ['Agus Salim', 'Project Director', 'Kami bisa melihat overbudget dua minggu lebih cepat. Itu menyelamatkan margin di beberapa proyek besar.'],
            ['Ferry Tanuwijaya', 'Pemilik Usaha', 'Stok antar cabang akhirnya terlihat jelas. Pendampingannya sabar sampai semua kepala toko bisa memakai sistem.'],
            ['dr. Melati Purnama', 'Direktur Klinik', 'Antrean pasien jauh lebih tertib dan rekam medis tidak ada lagi yang tercecer.'],
            ['Suryani Rahayu', 'Ketua Yayasan', 'Orang tua murid sekarang mendapat informasi tepat waktu. Administrasi sekolah jadi jauh lebih ringan.'],
            ['Joko Susilo', 'Ketua Koperasi', 'Persetujuan kredit dari seminggu menjadi satu hari. Anggota kami sangat merasakan bedanya.'],
            ['Stefanus Halim', 'VP Claims', 'Proses klaim lebih transparan. Nasabah bisa melihat status sendiri tanpa harus menelepon.'],
            ['Darmawan Effendi', 'Site Manager', 'Downtime alat berat turun signifikan karena perawatan sekarang terjadwal dan tercatat.'],
            ['Rudi Hermawan', 'HSE Manager', 'Inspeksi dan izin kerja sepenuhnya digital. Audit keselamatan jadi jauh lebih mudah.'],
            ['Hasan Basri', 'Estate Manager', 'Data panen per blok tersedia setiap hari dan selisih upah hampir tidak ada lagi.'],
            ['Yuliana Siregar', 'Export Manager', 'Dokumen ekspor tersusun lebih cepat dan pembeli luar negeri puas dengan traceability-nya.'],
            ['Michael Santoso', 'Direktur Pemasaran', 'Penagihan cicilan lebih tertib dan keluhan penghuni selesai lebih cepat.'],
            ['Ni Kadek Ayu', 'General Manager', 'Tidak ada lagi overbooking sejak semua kanal reservasi terhubung.'],
            ['Kevin Pranata', 'Operations Lead', 'Setiap outlet sekarang memakai resep dan HPP yang sama. Bahan terbuang turun drastis.'],
            ['Antonius Wirawan', 'Kepala Bengkel', 'Pelanggan lebih sering kembali servis karena pengingat jadwal berjalan otomatis.'],
            ['Eko Prasetya', 'Network Operations Manager', 'Koordinasi teknisi lapangan jauh lebih rapi dan gangguan selesai lebih cepat.'],
            ['Siti Nurhaliza', 'Manajer Operasional', 'Penjualan tiket online melonjak dan jadwal armada tidak lagi bentrok.'],
            ['Ir. Bambang Sutrisno', 'Kepala Dinas', 'Masyarakat kini mengurus izin dari rumah. Waktu terbit izin turun dari dua minggu menjadi tiga hari.'],
            ['Retno Palupi', 'Direktur Program', 'Laporan program untuk donatur kini tersusun otomatis dan penyaluran bantuan bisa dilacak.'],
        ];

        // The 20 demo case studies are the newest ones; their order matches the quotes above.
        $caseStudies = CaseStudy::query()
            ->orderByDesc('id')
            ->limit(count($rows))
            ->get(['id', 'client_name', 'sort_order'])
            ->sortBy('sort_order')
            ->values();

        foreach ($rows as $index => [$name, $position, $quote]) {
            $caseStudy = $caseStudies[$index] ?? null;

            Testimonial::query()->updateOrCreate(['author_name' => $name], [
                'case_study_id' => $caseStudy?->id,
                'author_position' => $position,
                'company' => $caseStudy?->client_name,
                'quote' => $quote,
                'photo' => DemoImages::avatar('testimonial-'.$name),
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }

    private function clientLogos(): void
    {
        // [fictional company, industry name, brand color]
        $rows = [
            ['Nusantara Plastindo', 'Manufaktur', '#2547F9'],
            ['Sinar Logistik Raya', 'Distribusi & Logistik', '#0F766E'],
            ['Graha Karya Konstruksi', 'Konstruksi', '#B45309'],
            ['Mitra Bangun Sentosa', 'Ritel', '#C2410C'],
            ['Klinik Sehat Utama', 'Kesehatan', '#0E7490'],
            ['Yayasan Cendekia Bangsa', 'Pendidikan', '#4338CA'],
            ['Koperasi Arta Makmur', 'Perbankan & Keuangan', '#15803D'],
            ['Proteksi Jaya Broker', 'Asuransi', '#1D4ED8'],
            ['Borneo Mineral Teknik', 'Pertambangan', '#78350F'],
            ['Samudra Energi Servis', 'Energi & Migas', '#BE123C'],
            ['Agro Lestari Nusantara', 'Agribisnis & Perkebunan', '#4D7C0F'],
            ['Bahari Segar Ekspor', 'Perikanan', '#0369A1'],
            ['Griya Asri Properti', 'Properti', '#7C3AED'],
            ['Dewata Boutique Hotels', 'Perhotelan & Pariwisata', '#A21CAF'],
            ['Kopi Senja Group', 'Makanan & Minuman', '#92400E'],
            ['Prima Motor Niaga', 'Otomotif', '#B91C1C'],
            ['Jaringan Data Nusa', 'Telekomunikasi', '#0284C7'],
            ['Trans Antarkota Prima', 'Transportasi', '#047857'],
            ['Pelayanan Terpadu Kabupaten', 'Pemerintahan', '#334155'],
            ['Peduli Sesama Foundation', 'Nirlaba', '#DB2777'],
        ];

        $industries = Industry::query()->pluck('id', 'name');

        foreach ($rows as $index => [$company, $industry, $color]) {
            ClientLogo::query()->updateOrCreate(['name' => $company], [
                'industry_id' => $industries[$industry] ?? null,
                'logo' => DemoImages::logo($company, $color),
                'website_url' => null,
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }

    private function milestones(): void
    {
        $rows = [
            [2018, 'Perusahaan berdiri', 'Dimulai sebagai tim kecil yang membantu digitalisasi UMKM manufaktur.'],
            [2018, 'Klien pertama di Cikarang', 'Mendigitalisasi pencatatan produksi untuk produsen kemasan plastik.'],
            [2019, 'Tim bertambah menjadi 10 orang', 'Merekrut desainer dan engineer pertama secara penuh waktu.'],
            [2019, 'Proyek distribusi pertama', 'Membangun aplikasi order sales lapangan untuk distributor FMCG.'],
            [2020, 'Fokus menjadi konsultan teknologi', 'Menambahkan layanan assessment dan pendampingan, bukan hanya pengembangan aplikasi.'],
            [2020, 'Layanan kerja jarak jauh', 'Membantu klien beradaptasi dengan pola kerja jarak jauh selama pandemi.'],
            [2021, 'Metodologi 7 tahap', 'Menyusun metodologi konsultasi dari discovery call hingga pendampingan.'],
            [2021, '20 klien aktif', 'Mendampingi klien di manufaktur, ritel, dan kesehatan.'],
            [2022, 'Divisi desain UI/UX', 'Membentuk divisi desain khusus untuk riset dan pengujian pengguna.'],
            [2022, 'Proyek pemerintahan pertama', 'Mendigitalisasi layanan perizinan sebuah pemerintah kabupaten.'],
            [2023, '50 proyek transformasi digital', 'Mendampingi klien dari manufaktur, distribusi, hingga konstruksi.'],
            [2023, 'Sertifikasi keamanan informasi', 'Menerapkan standar keamanan informasi untuk seluruh proyek.'],
            [2023, 'Layanan managed cloud', 'Mengelola infrastruktur cloud dan keamanan aplikasi klien.'],
            [2024, 'Tim mencapai 50 orang', 'Konsultan, desainer, dan engineer bekerja dari beberapa kota.'],
            [2024, 'Ekspansi ke sektor pertambangan', 'Membangun aplikasi perawatan alat berat di Kalimantan.'],
            [2024, '100 proyek selesai', 'Seratus proyek diselesaikan dengan tingkat kepuasan klien tinggi.'],
            [2025, 'Membuka kantor cabang', 'Memperluas jangkauan untuk mendampingi klien di luar Jabodetabek.'],
            [2025, 'Program pelatihan klien', 'Meluncurkan akademi pelatihan bagi pengguna aplikasi klien.'],
            [2026, 'Layanan data & AI terapan', 'Membantu klien memanfaatkan data operasional untuk prediksi dan otomasi.'],
            [2026, 'Hadir di 10 kota', 'Kantor dan tim pendamping tersebar di sepuluh kota di Indonesia.'],
        ];

        foreach ($rows as $index => [$year, $title, $description]) {
            CompanyMilestone::query()->updateOrCreate(
                ['year' => $year, 'title' => $title],
                ['description' => $description, 'sort_order' => $index],
            );
        }
    }

    private function offices(): void
    {
        $rows = [
            ['Kantor Pusat', OfficeType::Head, 'Jakarta', 'Jl. Jenderal Sudirman Kav. 52, Senayan, Kebayoran Baru', '(021) 5790 1200'],
            ['Kantor Cabang Bandung', OfficeType::Branch, 'Bandung', 'Jl. Asia Afrika No. 120, Braga, Sumur Bandung', '(022) 4203 118'],
            ['Kantor Cabang Surabaya', OfficeType::Branch, 'Surabaya', 'Jl. Basuki Rahmat No. 88, Tegalsari', '(031) 5470 221'],
            ['Kantor Cabang Semarang', OfficeType::Branch, 'Semarang', 'Jl. Pemuda No. 150, Sekayu, Semarang Tengah', '(024) 3560 412'],
            ['Kantor Cabang Yogyakarta', OfficeType::Branch, 'Yogyakarta', 'Jl. Laksda Adisucipto No. 45, Caturtunggal', '(0274) 488 120'],
            ['Kantor Cabang Medan', OfficeType::Branch, 'Medan', 'Jl. Gatot Subroto No. 210, Sei Sikambing', '(061) 4520 330'],
            ['Kantor Cabang Makassar', OfficeType::Branch, 'Makassar', 'Jl. Jenderal Sudirman No. 31, Pisang Utara', '(0411) 362 450'],
            ['Kantor Cabang Balikpapan', OfficeType::Branch, 'Balikpapan', 'Jl. MT Haryono No. 18, Damai Bahagia', '(0542) 871 220'],
            ['Kantor Cabang Pekanbaru', OfficeType::Branch, 'Pekanbaru', 'Jl. Jenderal Sudirman No. 400, Simpang Tiga', '(0761) 571 330'],
            ['Kantor Cabang Palembang', OfficeType::Branch, 'Palembang', 'Jl. Kapten A. Rivai No. 70, 26 Ilir', '(0711) 358 210'],
            ['Kantor Cabang Denpasar', OfficeType::Branch, 'Denpasar', 'Jl. Teuku Umar No. 99, Dauh Puri Kauh', '(0361) 224 510'],
            ['Kantor Cabang Malang', OfficeType::Branch, 'Malang', 'Jl. Ijen No. 25, Oro-oro Dowo, Klojen', '(0341) 551 230'],
            ['Kantor Cabang Batam', OfficeType::Branch, 'Batam', 'Jl. Raja Ali Haji No. 12, Sungai Jodoh', '(0778) 421 310'],
            ['Kantor Cabang Bekasi', OfficeType::Branch, 'Bekasi', 'Jl. Ahmad Yani No. 8, Kayuringin Jaya', '(021) 8895 2310'],
            ['Kantor Cabang Cikarang', OfficeType::Branch, 'Cikarang', 'Kawasan Industri Jababeka, Jl. Jababeka Raya Blok A', '(021) 8983 4410'],
            ['Kantor Cabang Tangerang', OfficeType::Branch, 'Tangerang', 'Jl. MH Thamrin No. 3, Cikokol', '(021) 5579 3120'],
            ['Kantor Cabang Solo', OfficeType::Branch, 'Surakarta', 'Jl. Slamet Riyadi No. 275, Penumping', '(0271) 712 450'],
            ['Kantor Cabang Banjarmasin', OfficeType::Branch, 'Banjarmasin', 'Jl. Ahmad Yani Km. 4, Kebun Bunga', '(0511) 325 610'],
            ['Kantor Cabang Manado', OfficeType::Branch, 'Manado', 'Jl. Sam Ratulangi No. 60, Wenang', '(0431) 862 170'],
            ['Kantor Cabang Lampung', OfficeType::Branch, 'Bandar Lampung', 'Jl. Raden Intan No. 88, Tanjung Karang', '(0721) 255 340'],
        ];

        foreach ($rows as $index => [$name, $type, $city, $address, $phone]) {
            $values = [
                'type' => $type,
                'city' => $city,
                'address' => "{$address}, {$city}",
                'phone' => $phone,
                'email' => Str::slug($city).'@simetricmedia.example',
                'map_url' => 'https://www.google.com/maps/search/?api=1&query='.rawurlencode("{$address}, {$city}"),
                'sort_order' => $index,
                'is_active' => true,
            ];

            // Keep the head office details managed by ContentSeeder / the admin panel.
            if ($type === OfficeType::Head && Office::query()->where('name', $name)->exists()) {
                continue;
            }

            Office::query()->updateOrCreate(['name' => $name], $values);
        }
    }
}
