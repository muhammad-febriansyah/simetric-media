<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Replace the plain deliverables list with capabilities (title + description),
     * add the methodology steps and SEO fields. Existing deliverables become capability titles.
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->json('capabilities')->nullable()->after('body');
            $table->json('methodology')->nullable()->after('capabilities');
            $table->string('meta_title', 70)->nullable()->after('sort_order');
            $table->string('meta_description', 160)->nullable()->after('meta_title');
        });

        DB::table('services')->orderBy('id')->each(function (object $service): void {
            $deliverables = json_decode($service->deliverables ?? '[]', true) ?: [];

            DB::table('services')->where('id', $service->id)->update([
                'capabilities' => json_encode(array_map(
                    fn (string $title): array => ['title' => $title, 'description' => null],
                    $deliverables,
                )),
            ]);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('deliverables');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->json('deliverables')->nullable()->after('body');
        });

        DB::table('services')->orderBy('id')->each(function (object $service): void {
            $capabilities = json_decode($service->capabilities ?? '[]', true) ?: [];

            DB::table('services')->where('id', $service->id)->update([
                'deliverables' => json_encode(array_column($capabilities, 'title')),
            ]);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['capabilities', 'methodology', 'meta_title', 'meta_description']);
        });
    }
};
