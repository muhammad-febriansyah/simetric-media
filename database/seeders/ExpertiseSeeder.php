<?php

namespace Database\Seeders;

use App\Models\Expertise;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

/**
 * The four default areas of expertise. Existing rows (edited in the admin panel) are kept as they are.
 */
class ExpertiseSeeder extends Seeder
{
    /**
     * slug => [name, description, icon]
     *
     * @var array<string, array{0: string, 1: string, 2: string}>
     */
    public const DEFAULTS = [
        'consulting' => ['Konsultasi & Strategi', 'Memetakan masalah bisnis dan menyusun roadmap digital yang realistis sebelum satu baris kode ditulis.', 'compass'],
        'design' => ['Desain', 'Merancang alur dan tampilan aplikasi bersama pengguna agar benar-benar dipakai tim Anda.', 'pen-tool'],
        'development' => ['Pengembangan', 'Membangun aplikasi web, mobile, dan integrasi sistem yang sesuai proses bisnis Anda.', 'code'],
        'support' => ['Pendampingan', 'Memastikan aplikasi berjalan: implementasi, pelatihan, migrasi data, hingga support berkelanjutan.', 'life-buoy'],
    ];

    public function run(): void
    {
        self::ids();
    }

    /**
     * Make sure the default expertises exist and return their ids keyed by slug.
     *
     * @return Collection<string, int>
     */
    public static function ids(): Collection
    {
        $sortOrder = 0;

        foreach (self::DEFAULTS as $slug => [$name, $description, $icon]) {
            Expertise::query()->firstOrCreate(['slug' => $slug], [
                'name' => $name,
                'description' => $description,
                'icon' => $icon,
                'sort_order' => $sortOrder++,
                'published_at' => now(),
            ]);
        }

        return Expertise::query()->pluck('id', 'slug');
    }
}
