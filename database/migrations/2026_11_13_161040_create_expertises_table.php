<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Service pillars move from a hardcoded enum to the admin-managed `expertises` table.
 * The four former pillars become the first expertises and every service is linked to its pillar.
 */
return new class extends Migration
{
    /**
     * The former ServicePillar enum: value => [name, description, icon].
     *
     * @var array<string, array{0: string, 1: string, 2: string}>
     */
    private const FORMER_PILLARS = [
        'consulting' => ['Konsultasi & Strategi', 'Memetakan masalah bisnis dan menyusun roadmap digital yang realistis sebelum satu baris kode ditulis.', 'compass'],
        'design' => ['Desain', 'Merancang alur dan tampilan aplikasi bersama pengguna agar benar-benar dipakai tim Anda.', 'pen-tool'],
        'development' => ['Pengembangan', 'Membangun aplikasi web, mobile, dan integrasi sistem yang sesuai proses bisnis Anda.', 'code'],
        'support' => ['Pendampingan', 'Memastikan aplikasi berjalan: implementasi, pelatihan, migrasi data, hingga support berkelanjutan.', 'life-buoy'],
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expertises', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 120)->unique();
            $table->string('description', 300)->nullable();
            $table->string('icon', 50)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('meta_title', 70)->nullable();
            $table->string('meta_description', 160)->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
        });

        $now = now();
        $sortOrder = 0;

        foreach (self::FORMER_PILLARS as $slug => [$name, $description, $icon]) {
            DB::table('expertises')->insert([
                'name' => $name,
                'slug' => $slug,
                'description' => $description,
                'icon' => $icon,
                'sort_order' => $sortOrder++,
                'published_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        Schema::table('services', function (Blueprint $table) {
            $table->foreignId('expertise_id')->nullable()->after('slug');
        });

        $expertiseIds = DB::table('expertises')->pluck('id', 'slug');

        foreach ($expertiseIds as $slug => $id) {
            DB::table('services')->where('pillar', $slug)->update(['expertise_id' => $id]);
        }

        DB::table('services')->whereNull('expertise_id')->update(['expertise_id' => $expertiseIds['consulting']]);

        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['pillar']);
            $table->dropColumn('pillar');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->foreignId('expertise_id')->nullable(false)->change();
            $table->foreign('expertise_id')->references('id')->on('expertises')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('pillar', 30)->default('consulting')->after('slug')->index();
        });

        $slugs = DB::table('expertises')->pluck('slug', 'id');

        foreach ($slugs as $id => $slug) {
            DB::table('services')->where('expertise_id', $id)->update([
                'pillar' => array_key_exists($slug, self::FORMER_PILLARS) ? $slug : 'consulting',
            ]);
        }

        Schema::table('services', function (Blueprint $table) {
            $table->dropForeign(['expertise_id']);
            $table->dropColumn('expertise_id');
        });

        Schema::dropIfExists('expertises');
    }
};
