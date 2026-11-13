<?php

namespace Database\Seeders;

use Database\Seeders\Demo\DemoCompanySeeder;
use Database\Seeders\Demo\DemoContentSeeder;
use Database\Seeders\Demo\DemoLeadSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Demo data: 20 fictional but realistic records per admin menu, with images
 * downloaded to storage/app/public/demo. Run manually, never in production:
 *
 *     php artisan db:seed --class=DemoSeeder
 *
 * Safe to run more than once (records are matched by slug/name/email).
 */
class DemoSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            DemoContentSeeder::class,
            DemoCompanySeeder::class,
            DemoLeadSeeder::class,
        ]);
    }
}
