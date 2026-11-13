<?php

namespace Database\Seeders;

use App\Models\ClientLogo;
use App\Models\Product;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * The company's own products, plus the partners/users and testimonials shown on their websites.
 * Images are bundled in database/seeders/assets and copied to the public disk only when the record
 * has no image yet, so admin uploads are kept.
 */
class ProductSeeder extends Seeder
{
    private const ASSET_DIRECTORY = __DIR__.'/assets';

    public function run(): void
    {
        foreach ($this->products() as $index => $data) {
            $product = Product::query()->firstOrNew(['slug' => $data['slug']]);
            $isNew = ! $product->exists;

            $product->fill([
                ...$data,
                'sort_order' => $index,
                'is_featured' => $isNew ? true : $product->is_featured,
                'published_at' => $product->published_at ?? now(),
            ]);

            $product->logo ??= $this->copyAsset("products/{$data['slug']}-logo.png", 'products/logos');
            $product->cover_image ??= $this->copyAsset("products/{$data['slug']}-cover.jpg", 'products');
            $product->save();
        }

        $this->clientLogos();
        $this->testimonials();
    }

    /**
     * Partners of LegalPartner.ID and companies hiring through KarirConnect, as shown on those websites.
     */
    private function clientLogos(): void
    {
        $logos = [
            'legalpartner' => [
                'Tokopedia' => 'tokopedia.png',
                'Gojek' => 'gojek.png',
                'Bank Rakyat Indonesia' => 'bank-rakyat-indonesia.png',
                'Telkom Indonesia' => 'telkom-indonesia.png',
                'Indofood' => 'indofood.png',
            ],
            'karirconnect' => [
                'PT. Indobest Artha Kreasi' => 'pt-indobest-artha-kreasi.jpg',
                'CV. Tiga Bintang Sejahtera Food' => 'cv-tiga-bintang-sejahtera-food.jpg',
                'PT. Sinwen Anugerah Alpha Omega' => 'pt-sinwen-anugerah-alpha-omega.png',
                'PT. Mandiri Raya Tangguh' => 'pt-mandiri-raya-tangguh.png',
                'Scent Avenue' => 'scent-avenue.png',
                'PT. Woodone Integra Indonesia' => 'pt-woodone-integra-indonesia.png',
                'Gautama' => 'gautama.jpeg',
                'Fruitywax Indonesia' => 'fruitywax-indonesia.jpg',
                'Glamazing Indonesia & Voilav Indonesia' => 'glamazing-indonesia-voilav-indonesia.jpeg',
                'PT. Diet Nyaman Indonesia' => 'pt-diet-nyaman-indonesia.jpeg',
                'ARTOTEL Yogyakarta' => 'artotel-yogyakarta.jpg',
                'PT. Gumindo Bogamanis' => 'pt-gumindo-bogamanis.jpg',
                'Callista Project' => 'callista-project.jpg',
                'CV. Sinergi Triputra Teknindo' => 'cv-sinergi-triputra-teknindo.jpg',
                'Immoderma Aesthetic and Wellness Clinic' => 'immoderma-aesthetic-and-wellness-clinic.png',
                'PT. Rasa Juara Indonesia' => 'pt-rasa-juara-indonesia.jpeg',
                'PT. Digikidz Indonesia' => 'pt-digikidz-indonesia.png',
                'Apotek Gema' => 'apotek-gema.png',
                'PT Flower Factory Indonesia' => 'pt-flower-factory-indonesia.jpg',
                'PT. Kaja Sarana Inovasi' => 'pt-kaja-sarana-inovasi.png',
                'PT. Inti Surya Laboratorium' => 'pt-inti-surya-laboratorium.png',
            ],
        ];

        $products = Product::query()->pluck('id', 'slug');
        $sortOrder = 0;

        foreach ($logos as $productSlug => $companies) {
            foreach ($companies as $name => $file) {
                $clientLogo = ClientLogo::query()->firstOrNew(['name' => $name]);
                $clientLogo->product_id ??= $products[$productSlug] ?? null;
                $clientLogo->logo ??= $this->copyAsset("client-logos/{$file}", 'client-logos');
                $clientLogo->sort_order = $clientLogo->exists ? $clientLogo->sort_order : $sortOrder;
                $clientLogo->is_active ??= true;

                if ($clientLogo->logo) {
                    $clientLogo->save();
                }

                $sortOrder++;
            }
        }
    }

    /**
     * Testimonials shown on the ChatCepat website.
     */
    private function testimonials(): void
    {
        $testimonials = [
            ['Sari Wijaya', 'Owner', 'Batik Nusantara', 'Sejak pakai ChatCepat, balasan ke pelanggan WhatsApp jadi instan. Omzet toko online kami naik hampir 30% dalam dua bulan.'],
            ['Andi Pratama', 'Head of Sales', 'GadgetKita', 'AI Agent-nya betul-betul paham produk kami. Pertanyaan stok dan ongkir terjawab otomatis, tim CS bisa fokus ke closing.'],
            ['Maya Kusuma', 'Founder', 'Skincare Lokal', 'Dulu DM Instagram dan WhatsApp kami berantakan. Sekarang semua masuk satu inbox dan tidak ada chat yang terlewat lagi.'],
            ['Reza Mahendra', 'Direktur', 'Digital Partner ID', 'Sebagai agency, fitur multi-tenant sangat membantu. Kami kelola belasan klien dari satu dasbor dengan data yang rapi.'],
            ['Putri Anjani', 'Marketing Lead', 'Kopi Senja', 'Broadcast yang patuh consent bikin kami tenang. Kampanye promo tetap efektif tanpa khawatir nomor diblokir.'],
            ['Bagus Setiawan', 'Operations', 'FurnitureHub', 'Setup-nya cepat, dalam sehari sudah jalan. Analitik waktu respons membantu kami memperbaiki layanan tiap minggu.'],
        ];

        $productId = Product::query()->where('slug', 'chatcepat')->value('id');

        foreach ($testimonials as $index => [$name, $position, $company, $quote]) {
            Testimonial::query()->firstOrCreate(['author_name' => $name, 'company' => $company], [
                'product_id' => $productId,
                'author_position' => $position,
                'quote' => $quote,
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function products(): array
    {
        return [
            [
                'name' => 'LegalPartner.ID',
                'slug' => 'legalpartner',
                'category' => 'Legalitas & Perizinan',
                'tagline' => 'Anda fokus bangun usaha, legalitas dan perizinan serahkan kepada kami.',
                'summary' => 'Platform layanan legalitas usaha: pendirian PT dan CV, perizinan OSS RBA, pendaftaran merek, hingga pendampingan pajak dengan biaya jelas di awal.',
                'body' => "LegalPartner.ID mendampingi pelaku usaha sejak hari pertama mendirikan perusahaan: memilih bentuk badan usaha, mengurus perizinan, mendaftarkan merek, sampai mengelola pembukuan dan pajak.\n\nSetiap layanan menampilkan dokumen, proses, estimasi waktu, dan biaya sejak awal, sehingga klien tahu persis apa yang akan mereka dapatkan. Prosesnya dibagi menjadi empat langkah sederhana: konsultasi awal, penawaran dan rencana, proses pengurusan, lalu serah terima dokumen resmi.",
                'website_url' => 'https://legalpartner.id',
                'features' => [
                    ['title' => 'Pendirian badan usaha', 'description' => 'PT Umum, PT Perorangan, PT PMA, CV, dan yayasan dalam satu paket yang jelas.'],
                    ['title' => 'Perizinan OSS RBA', 'description' => 'NIB, izin operasional, SBUJK, PBG, dan izin sektor khusus.'],
                    ['title' => 'Kekayaan intelektual', 'description' => 'Pendaftaran merek dan hak cipta ke DJKI beserta pemantauan statusnya.'],
                    ['title' => 'Pajak & laporan keuangan', 'description' => 'Pendampingan pajak bulanan, tahunan, dan penyusunan laporan keuangan.'],
                    ['title' => 'Biaya transparan', 'description' => 'Harga, durasi, dan dokumen yang dibutuhkan tampil sebelum klien memesan.'],
                ],
                'highlights' => [
                    ['label' => 'Layanan legalitas', 'value' => '22'],
                    ['label' => 'Pilihan paket', 'value' => '66'],
                    ['label' => 'Kategori layanan', 'value' => '7'],
                    ['label' => 'Jaringan mitra', 'value' => '20'],
                ],
                'meta_description' => 'LegalPartner.ID: layanan pendirian PT, CV, perizinan usaha, pendaftaran merek, dan perpajakan dengan biaya jelas.',
            ],
            [
                'name' => 'ChatCepat',
                'slug' => 'chatcepat',
                'category' => 'Omnichannel & AI',
                'tagline' => 'Semua channel chat dalam satu inbox, dibalas AI Agent otomatis 24 jam.',
                'summary' => 'Platform customer service omnichannel untuk UMKM: WhatsApp, Instagram, Facebook, dan Telegram dalam satu layar, dengan AI Agent yang paham produk dan membantu menutup penjualan.',
                'body' => "ChatCepat menyatukan percakapan pelanggan dari WhatsApp, Instagram, Messenger, dan Telegram ke satu kotak masuk. AI Agent membaca basis pengetahuan produk lalu menjawab pertanyaan stok, harga, dan ongkir secara otomatis, dan menyerahkan percakapan ke agen manusia saat dibutuhkan.\n\nBisnis bisa terhubung dalam tiga langkah: hubungkan channel, atur AI dan flow otomasi tanpa coding, lalu biarkan AI membalas. Cocok untuk e-commerce, F&B, jasa dan klinik, hingga agency yang mengelola banyak brand.",
                'website_url' => 'https://www.chatcepat.id',
                'features' => [
                    ['title' => 'Inbox omnichannel', 'description' => 'WhatsApp, Instagram, Facebook, dan Telegram dalam satu antrian.'],
                    ['title' => 'AI Agent + RAG', 'description' => 'Menjawab akurat dari basis pengetahuan produk, 24 jam, dengan eskalasi mulus ke agen.'],
                    ['title' => 'Flow otomasi tanpa coding', 'description' => 'Builder visual untuk salam otomatis, kualifikasi lead, hingga eskalasi.'],
                    ['title' => 'Broadcast patuh consent', 'description' => 'Kampanye terjadwal hanya ke kontak yang sudah opt-in.'],
                    ['title' => 'Multi-tenant & tim', 'description' => 'Peran dan izin granular dengan isolasi data per tenant, aman untuk agency.'],
                ],
                'highlights' => [
                    ['label' => 'Bisnis pengguna', 'value' => '500+'],
                    ['label' => 'Balasan otomatis', 'value' => '92%'],
                    ['label' => 'Rata-rata waktu balas', 'value' => '< 3 dtk'],
                    ['label' => 'Waktu setup', 'value' => '5 menit'],
                ],
                'meta_description' => 'ChatCepat: inbox omnichannel WhatsApp, Instagram, Facebook, dan Telegram dengan AI Sales Agent untuk UMKM.',
            ],
            [
                'name' => 'KarirConnect',
                'slug' => 'karirconnect',
                'category' => 'Rekrutmen & Karier',
                'tagline' => 'Temukan karier impianmu #BarengKarirConnect.',
                'summary' => 'Platform pencarian kerja dengan lowongan dari perusahaan terverifikasi, AI CV Analyzer, AI Career Coach, dan fitur ATS untuk perusahaan yang ingin merekrut lebih cepat.',
                'body' => "KarirConnect mempertemukan pencari kerja dengan perusahaan terverifikasi di seluruh Indonesia. Kandidat bisa mencari lowongan berdasarkan kategori, lokasi, jenis kerja, hingga filter khusus seperti fresh graduate atau kerja remote, semuanya gratis.\n\nFitur AI CV Analyzer memberi skor ATS, analisis kata kunci per industri, dan rekomendasi perbaikan CV secara instan. Untuk perusahaan, KarirConnect menyediakan posting lowongan, akses database kandidat, dan ATS untuk mempercepat proses rekrutmen.",
                'website_url' => 'https://karirconnect.id',
                'features' => [
                    ['title' => 'Lowongan terverifikasi', 'description' => 'Posisi dari perusahaan terverifikasi dengan filter kategori, lokasi, dan jenis kerja.'],
                    ['title' => 'AI CV Analyzer', 'description' => 'Skor ATS 0-100, analisis kata kunci, dan rekomendasi format CV.'],
                    ['title' => 'AI Career Coach & Interview', 'description' => 'Latihan wawancara dan arahan karier berbasis AI.'],
                    ['title' => 'ATS untuk perusahaan', 'description' => 'Posting lowongan, database kandidat, dan pengelolaan pelamar dalam satu tempat.'],
                ],
                'highlights' => [
                    ['label' => 'Perusahaan bergabung', 'value' => '124+'],
                    ['label' => 'Rating pengguna', 'value' => '4,8'],
                    ['label' => 'Biaya untuk kandidat', 'value' => 'Gratis'],
                ],
                'meta_description' => 'KarirConnect: platform pencarian kerja dengan AI CV Analyzer, AI Career Coach, dan lowongan dari perusahaan terverifikasi.',
            ],
        ];
    }

    /**
     * Copy a bundled image to the public disk and return its path, or null when the file is missing.
     */
    private function copyAsset(string $asset, string $directory): ?string
    {
        $source = self::ASSET_DIRECTORY.'/'.$asset;

        if (! is_file($source)) {
            return null;
        }

        $path = $directory.'/'.basename($asset);
        Storage::disk('public')->put($path, file_get_contents($source));

        return $path;
    }
}
