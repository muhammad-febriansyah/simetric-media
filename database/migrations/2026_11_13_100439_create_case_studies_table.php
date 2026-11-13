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
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('industry_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->string('client_name', 150);
            $table->string('excerpt', 300)->nullable();
            $table->string('cover_image')->nullable();
            $table->text('challenge');
            $table->text('assessment')->nullable();
            $table->text('recommendation')->nullable();
            $table->text('solution');
            $table->json('results')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_studies');
    }
};
