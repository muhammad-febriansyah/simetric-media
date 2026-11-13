<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('case_studies', function (Blueprint $table) {
            $table->string('project_period', 50)->nullable()->after('client_name');
            $table->string('organization_type', 30)->nullable()->after('project_period');
            $table->json('key_insights')->nullable()->after('results');
            $table->string('meta_title', 70)->nullable()->after('sort_order');
            $table->string('meta_description', 160)->nullable()->after('meta_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('case_studies', function (Blueprint $table) {
            $table->dropColumn(['project_period', 'organization_type', 'key_insights', 'meta_title', 'meta_description']);
        });
    }
};
