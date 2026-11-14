<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

/**
 * Starter questions for the home page FAQ. Only creates missing questions, so
 * answers edited in the admin panel are never overwritten.
 */
class HomeFaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            ['Apakah konsultasi awal benar-benar gratis?', 'Ya. Konsultasi awal gratis dan tanpa komitmen. Tujuannya memahami masalah bisnis Anda dan menentukan langkah berikutnya.'],
            ['Bagaimana cara memulai?', 'Isi form Konsultasi Gratis atau hubungi kami lewat WhatsApp. Ceritakan masalah bisnis Anda, lalu kami jadwalkan konsultasi awal.'],
            ['Apakah sistem lama kami harus diganti?', 'Tidak selalu. Kami mengutamakan integrasi dengan sistem yang sudah berjalan bila itu lebih efisien.'],
            ['Berapa lama sampai aplikasi bisa dipakai?', 'Tergantung cakupan. Setelah assessment, Anda menerima roadmap dengan estimasi waktu per tahap sebelum pengembangan dimulai.'],
            ['Apakah ada pendampingan setelah aplikasi berjalan?', 'Ya. Setelah aplikasi live, kami tetap mendampingi lewat support, maintenance, dan pengembangan lanjutan.'],
            ['Industri apa saja yang pernah ditangani?', 'Kami mendampingi bisnis di berbagai industri, di antaranya manufaktur, distribusi dan logistik, konstruksi, ritel, kesehatan, dan pendidikan.'],
        ])->each(fn (array $faq, int $index): Faq => Faq::query()->firstOrCreate(
            ['page' => 'home', 'question' => $faq[0]],
            ['answer' => $faq[1], 'sort_order' => $index, 'is_active' => true],
        ));
    }
}
