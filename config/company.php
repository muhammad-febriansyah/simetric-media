<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Company Profile
    |--------------------------------------------------------------------------
    |
    | Static company information shown on the public website. Replace these
    | placeholders with the client's final brand and contact details.
    |
    */

    'tagline' => 'Konsultan teknologi yang mendampingi bisnis Anda dari A sampai Z.',

    'contact' => [
        'email' => env('COMPANY_EMAIL', 'halo@example.com'),
        'phone' => env('COMPANY_PHONE', '+62 21 0000 0000'),
        'whatsapp' => env('COMPANY_WHATSAPP', '6280000000000'),
        'address' => env('COMPANY_ADDRESS', 'Jakarta, Indonesia'),
    ],

    'social' => [
        'linkedin' => env('COMPANY_LINKEDIN'),
        'instagram' => env('COMPANY_INSTAGRAM'),
        'youtube' => env('COMPANY_YOUTUBE'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Consulting Process
    |--------------------------------------------------------------------------
    |
    | The seven-step engagement shown on the home page and the "How We Work"
    | page. Each step lists what the client receives and an indicative duration.
    |
    */

    'process' => [
        [
            'title' => 'Konsultasi Awal',
            'description' => 'Kami mendengarkan masalah bisnis Anda terlebih dahulu, tanpa langsung menawarkan produk. Gratis dan tanpa komitmen.',
            'deliverable' => 'Pemahaman awal masalah dan langkah berikutnya',
            'duration' => '1–2 hari',
        ],
        [
            'title' => 'Discovery & Assessment',
            'description' => 'Kami memetakan proses bisnis, sistem yang sudah berjalan, dan kebutuhan setiap tim yang terlibat.',
            'deliverable' => 'Laporan assessment proses dan sistem',
            'duration' => '1–3 minggu',
        ],
        [
            'title' => 'Rekomendasi & Roadmap',
            'description' => 'Kami merekomendasikan solusi yang paling masuk akal, lengkap dengan prioritas, estimasi biaya, dan waktu.',
            'deliverable' => 'Roadmap solusi, estimasi biaya, dan jadwal',
            'duration' => '1 minggu',
        ],
        [
            'title' => 'Desain & Prototipe',
            'description' => 'Alur dan tampilan aplikasi divalidasi bersama pengguna Anda sebelum mulai dibangun.',
            'deliverable' => 'Prototipe interaktif yang sudah disetujui',
            'duration' => '2–4 minggu',
        ],
        [
            'title' => 'Pengembangan',
            'description' => 'Aplikasi dibangun bertahap dengan demo berkala, sehingga Anda selalu tahu progresnya.',
            'deliverable' => 'Aplikasi yang diuji per tahap',
            'duration' => 'Sesuai roadmap',
        ],
        [
            'title' => 'Implementasi & Training',
            'description' => 'Kami mendampingi go-live, migrasi data, dan pelatihan agar tim Anda benar-benar memakai aplikasinya.',
            'deliverable' => 'Aplikasi live dan tim yang terlatih',
            'duration' => '1–4 minggu',
        ],
        [
            'title' => 'Pendampingan',
            'description' => 'Setelah live, kami tetap mendampingi lewat support, maintenance, dan pengembangan lanjutan.',
            'deliverable' => 'Support dan laporan berkala',
            'duration' => 'Berkelanjutan',
        ],
    ],

];
