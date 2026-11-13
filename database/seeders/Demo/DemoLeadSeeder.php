<?php

namespace Database\Seeders\Demo;

use App\Enums\BudgetRange;
use App\Enums\BusinessFunction;
use App\Enums\CompanySize;
use App\Enums\LeadActivityType;
use App\Enums\LeadStatus;
use App\Enums\ProjectTimeline;
use App\Models\ConsultationRequest;
use App\Models\Industry;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Demo admin users (lead PICs) and 20 consultation requests with an activity timeline.
 * All people and companies are fictional.
 */
class DemoLeadSeeder extends Seeder
{
    /**
     * Pipeline order used to build each lead's status history.
     *
     * @var list<LeadStatus>
     */
    private const PIPELINE = [
        LeadStatus::New,
        LeadStatus::DiscoveryCall,
        LeadStatus::Assessment,
        LeadStatus::Proposal,
        LeadStatus::Won,
    ];

    public function run(): void
    {
        $users = $this->users();
        $this->leads($users->where('is_admin', true)->values());
    }

    /**
     * @return Collection<int, User>
     */
    private function users(): Collection
    {
        // [name, admin?]
        $rows = [
            ['Wulan Safitri', true],
            ['Bayu Prasetyo', true],
            ['Sinta Maharani', true],
            ['Dimas Aditya', true],
            ['Nadia Putri Lestari', true],
            ['Ratna Kusumawardani', true],
            ['Citra Ayuningtyas', false],
            ['Larasati Wulandari', false],
            ['Rizky Ramadhan', false],
            ['Fajar Nugroho', false],
            ['Arief Setiawan', false],
            ['Maya Sari Dewi', false],
            ['Yoga Pratama', false],
            ['Indah Permatasari', false],
            ['Galih Saputra', false],
            ['Putri Handayani', false],
            ['Teguh Santoso', false],
            ['Hendra Gunawan', false],
            ['Dewi Anggraini', false],
        ];

        return collect($rows)->map(function (array $row): User {
            [$name, $isAdmin] = $row;
            $email = Str::of($name)->lower()->ascii()->replace(' ', '.')->append('@simetricmedia.example')->toString();

            $user = User::query()->firstOrNew(['email' => $email]);

            if (! $user->exists) {
                // Random password: demo accounts cannot be logged into until an admin resets it.
                $user->password = Hash::make(Str::password(24));
                $user->email_verified_at = now();
            }

            $user->name = $name;
            $user->is_admin = $isAdmin;
            $user->save();

            return $user;
        });
    }

    /**
     * @param  Collection<int, User>  $pics
     */
    private function leads(Collection $pics): void
    {
        // [name, job title, company, industry, size, problem area, timeline, budget, final status, days ago, description]
        $rows = [
            ['Bambang Wijaya', 'Direktur Operasional', 'PT Kemas Prima Industri', 'Manufaktur', CompanySize::Large, BusinessFunction::Operations, ProjectTimeline::OneToThreeMonths, BudgetRange::From150mTo500m, LeadStatus::Won, 170, 'Data produksi tiga shift masih dicatat di kertas lalu diketik ulang ke Excel. Laporan ke direksi selalu terlambat.'],
            ['Sri Lestari', 'Manajer Gudang', 'CV Sumber Rejeki Distribusi', 'Distribusi & Logistik', CompanySize::Medium, BusinessFunction::Operations, ProjectTimeline::Asap, BudgetRange::From50mTo150m, LeadStatus::Won, 155, 'Stok di sistem dan fisik gudang sering selisih. Kami punya 3 gudang di Jawa Timur.'],
            ['Hendrik Sitompul', 'Project Control Manager', 'PT Bangun Persada Konstruksi', 'Konstruksi', CompanySize::Large, BusinessFunction::Finance, ProjectTimeline::ThreeToSixMonths, BudgetRange::Above500m, LeadStatus::Lost, 140, 'Biaya proyek baru ketahuan membengkak setelah proyek hampir selesai.'],
            ['Lilis Suryani', 'Pemilik', 'Toko Bangunan Sinar Jaya', 'Ritel', CompanySize::Small, BusinessFunction::Sales, ProjectTimeline::Exploring, BudgetRange::Under50m, LeadStatus::Lost, 128, 'Ingin tahu apakah perlu aplikasi kasir baru atau cukup memperbaiki yang ada.'],
            ['dr. Arif Hidayat', 'Direktur', 'Klinik Pratama Medika Sehat', 'Kesehatan', CompanySize::Medium, BusinessFunction::Operations, ProjectTimeline::OneToThreeMonths, BudgetRange::From150mTo500m, LeadStatus::Won, 118, 'Antrean pasien panjang di pagi hari dan rekam medis masih berupa map fisik.'],
            ['Yohanes Kurniawan', 'Kepala Bagian TI', 'Yayasan Pendidikan Tunas Harapan', 'Pendidikan', CompanySize::Medium, BusinessFunction::InformationTechnology, ProjectTimeline::ThreeToSixMonths, BudgetRange::From50mTo150m, LeadStatus::Proposal, 96, 'Sistem akademik lama tidak bisa diakses orang tua dan sering error saat penerimaan siswa baru.'],
            ['Rahmat Hidayat', 'Ketua Pengurus', 'Koperasi Simpan Pinjam Sejahtera', 'Perbankan & Keuangan', CompanySize::Small, BusinessFunction::Finance, ProjectTimeline::OneToThreeMonths, BudgetRange::From50mTo150m, LeadStatus::Proposal, 84, 'Pengajuan kredit anggota masih manual dan butuh tanda tangan berlapis.'],
            ['Grace Natalia', 'Head of Operations', 'PT Proteksi Insan Mandiri', 'Asuransi', CompanySize::Large, BusinessFunction::Operations, ProjectTimeline::ThreeToSixMonths, BudgetRange::Above500m, LeadStatus::Assessment, 70, 'Klaim nasabah masuk lewat email dan WhatsApp, sulit dilacak statusnya.'],
            ['Taufik Hidayatullah', 'Plant Manager', 'PT Tambang Borneo Lestari', 'Pertambangan', CompanySize::Enterprise, BusinessFunction::Operations, ProjectTimeline::Asap, BudgetRange::Above500m, LeadStatus::Assessment, 58, 'Jam operasi alat berat dicatat manual oleh operator, data perawatan tidak lengkap.'],
            ['Irwan Saputra', 'HSE Superintendent', 'PT Energi Samudra Teknik', 'Energi & Migas', CompanySize::Large, BusinessFunction::Operations, ProjectTimeline::OneToThreeMonths, BudgetRange::From150mTo500m, LeadStatus::DiscoveryCall, 45, 'Izin kerja dan inspeksi K3 masih berupa formulir kertas.'],
            ['Suparman', 'Kepala Kebun', 'PT Sawit Makmur Abadi', 'Agribisnis & Perkebunan', CompanySize::Enterprise, BusinessFunction::HumanResource, ProjectTimeline::ThreeToSixMonths, BudgetRange::From150mTo500m, LeadStatus::DiscoveryCall, 38, 'Upah harian pemanen dihitung manual dan sering ada keluhan selisih.'],
            ['Wayan Sudarsana', 'General Manager', 'Bali Harmoni Resort', 'Perhotelan & Pariwisata', CompanySize::Medium, BusinessFunction::Sales, ProjectTimeline::OneToThreeMonths, BudgetRange::From50mTo150m, LeadStatus::Proposal, 30, 'Reservasi dari OTA, website, dan telepon tidak sinkron sehingga sempat terjadi overbooking.'],
            ['Feby Anggraeni', 'Finance Manager', 'PT Griya Asri Sentosa', 'Properti', CompanySize::Medium, BusinessFunction::Finance, ProjectTimeline::Asap, BudgetRange::From50mTo150m, LeadStatus::Assessment, 24, 'Penagihan cicilan dan IPL penghuni masih lewat spreadsheet dan telepon satu per satu.'],
            ['Andi Firmansyah', 'Operations Manager', 'Kopi Nusantara Group', 'Makanan & Minuman', CompanySize::Medium, BusinessFunction::Operations, ProjectTimeline::OneToThreeMonths, BudgetRange::From50mTo150m, LeadStatus::DiscoveryCall, 18, 'HPP tiap outlet berbeda-beda dan bahan baku sering kedaluwarsa.'],
            ['Stevanus Gunadi', 'Service Manager', 'PT Prima Motor Sejahtera', 'Otomotif', CompanySize::Large, BusinessFunction::Sales, ProjectTimeline::Exploring, BudgetRange::NotSure, LeadStatus::New, 12, 'Ingin membuat pengingat servis otomatis untuk pelanggan.'],
            ['Rina Marlina', 'NOC Supervisor', 'PT Jaringan Data Nusantara', 'Telekomunikasi', CompanySize::Medium, BusinessFunction::InformationTechnology, ProjectTimeline::Asap, BudgetRange::From150mTo500m, LeadStatus::New, 6, 'Tiket gangguan pelanggan menumpuk dan teknisi lapangan sulit dikoordinasi.'],
            ['Hadi Purnomo', 'Direktur', 'PO Trans Jaya Abadi', 'Transportasi', CompanySize::Medium, BusinessFunction::Sales, ProjectTimeline::OneToThreeMonths, BudgetRange::From50mTo150m, LeadStatus::New, 4, 'Pemesanan tiket masih lewat agen dan telepon, ingin mulai menjual online.'],
            ['Nurul Aini', 'Kepala Bidang Layanan', 'Dinas Penanaman Modal Kabupaten', 'Pemerintahan', CompanySize::Medium, BusinessFunction::Other, ProjectTimeline::ThreeToSixMonths, BudgetRange::NotSure, LeadStatus::New, 3, 'Ingin layanan perizinan bisa diajukan dan dipantau secara online oleh masyarakat.'],
            ['Kristina Manurung', 'Program Manager', 'Yayasan Kasih Peduli', 'Nirlaba', CompanySize::Small, BusinessFunction::Finance, ProjectTimeline::Exploring, BudgetRange::Under50m, LeadStatus::New, 1, 'Data donatur tersebar di beberapa file dan laporan penyaluran sulit disusun.'],
            ['Agung Setiadi', 'Supply Chain Head', 'PT Segar Bahari Nusantara', 'Perikanan', CompanySize::Large, BusinessFunction::Operations, ProjectTimeline::Asap, BudgetRange::From150mTo500m, LeadStatus::New, 0, 'Pembeli luar negeri meminta traceability per batch produk udang.'],
        ];

        $industries = Industry::query()->pluck('id', 'name');

        foreach ($rows as $index => $row) {
            [$name, $jobTitle, $company, $industry, $size, $area, $timeline, $budget, $finalStatus, $daysAgo, $description] = $row;

            $createdAt = min(
                Carbon::now()->subDays($daysAgo)->setTime(8 + ($index % 9), ($index * 7) % 60),
                Carbon::now()->subHour(),
            );
            // Leave two of the newest leads without a PIC so "needs attention" has data.
            $pic = $finalStatus === LeadStatus::New && $index % 2 === 0 ? null : $pics[$index % $pics->count()];
            $email = Str::of($name)->lower()->ascii()->replaceMatches('/[^a-z ]/', '')->trim()->replace(' ', '.')
                ->append('@', Str::slug($company), '.example')->toString();

            $lead = ConsultationRequest::withTrashed()->firstOrNew(['email' => $email]);

            if ($lead->exists) {
                continue;
            }

            $lead->forceFill([
                'industry_id' => $industries[$industry] ?? null,
                'assigned_to' => $pic?->id,
                'name' => $name,
                'phone' => '08'.str_pad((string) (1200000000 + $index * 7654321), 10, '0', STR_PAD_LEFT),
                'job_title' => $jobTitle,
                'company_name' => $company,
                'company_size' => $size,
                'problem_area' => $area,
                'problem_description' => $description,
                'timeline' => $timeline,
                'budget_range' => $budget,
                'status' => $finalStatus,
                'source_page' => $index % 3 === 0 ? '/konsultasi' : '/studi-kasus',
                'utm' => $index % 4 === 0 ? ['utm_source' => 'google', 'utm_medium' => 'cpc', 'utm_campaign' => 'konsultasi-gratis'] : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ])->save();

            $this->timeline($lead, $finalStatus, $pic, $createdAt);
        }
    }

    /**
     * Activity history from "created" up to the lead's current status.
     */
    private function timeline(ConsultationRequest $lead, LeadStatus $finalStatus, ?User $pic, Carbon $createdAt): void
    {
        $at = $createdAt->copy();
        $log = function (LeadActivityType $type, ?User $user, array $attributes = []) use ($lead, &$at): void {
            $activity = $lead->recordActivity($type, $user, $attributes);
            $activity->forceFill(['created_at' => $at, 'updated_at' => $at])->save();
        };

        $log(LeadActivityType::Created, null);

        if (! $pic) {
            return;
        }

        $at = $at->copy()->addHours(3);
        $log(LeadActivityType::Assigned, $pic, ['note' => "Ditugaskan ke {$pic->name}."]);

        $path = $finalStatus === LeadStatus::Lost
            ? [...array_slice(self::PIPELINE, 0, 4), LeadStatus::Lost]
            : array_slice(self::PIPELINE, 0, array_search($finalStatus, self::PIPELINE, true) + 1);

        $notes = [
            LeadStatus::DiscoveryCall->value => 'Discovery call 45 menit. Masalah utama sudah dipetakan, klien setuju lanjut ke assessment.',
            LeadStatus::Assessment->value => 'Kunjungan lokasi dan wawancara tim inti dijadwalkan minggu ini.',
            LeadStatus::Proposal->value => 'Proposal dan roadmap bertahap sudah dikirim ke direksi.',
            LeadStatus::Won->value => 'Kontrak ditandatangani. Kick-off proyek dijadwalkan.',
            LeadStatus::Lost->value => 'Klien menunda proyek ke tahun anggaran berikutnya.',
        ];

        foreach (array_slice($path, 1) as $step => $status) {
            $from = $path[$step];
            // Keep the history inside the lead's lifetime even for recent leads.
            $at = min($at->copy()->addDays(4 + $step * 3), Carbon::now()->subMinutes(10 * (5 - $step)));

            $log(LeadActivityType::StatusChanged, $pic, ['from_status' => $from, 'to_status' => $status]);
            $log(LeadActivityType::Note, $pic, ['note' => $notes[$status->value]]);
        }
    }
}
