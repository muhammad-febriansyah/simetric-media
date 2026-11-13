<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Testimonials and client logos can belong to one of the company's products.
     */
    public function up(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->foreignId('product_id')->nullable()->after('case_study_id')->constrained()->nullOnDelete();
        });

        Schema::table('client_logos', function (Blueprint $table) {
            $table->foreignId('product_id')->nullable()->after('industry_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_id');
        });

        Schema::table('client_logos', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_id');
        });
    }
};
