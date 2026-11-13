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
        Schema::create('consultation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('industry_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name', 100);
            $table->string('email', 150)->index();
            $table->string('phone', 30);
            $table->string('job_title', 100)->nullable();
            $table->string('company_name', 150);
            $table->string('company_size', 20)->nullable();
            $table->string('problem_area', 30);
            $table->text('problem_description');
            $table->string('timeline', 20)->nullable();
            $table->string('budget_range', 20)->nullable();
            $table->string('status', 20)->default('new');
            $table->string('source_page')->nullable();
            $table->json('utm')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_requests');
    }
};
