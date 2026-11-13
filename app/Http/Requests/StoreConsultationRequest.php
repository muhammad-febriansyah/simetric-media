<?php

namespace App\Http\Requests;

use App\Enums\BudgetRange;
use App\Enums\BusinessFunction;
use App\Enums\CompanySize;
use App\Enums\ProjectTimeline;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConsultationRequest extends FormRequest
{
    /**
     * Anyone may request a consultation.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * The "website" field is a honeypot: real visitors never see or fill it.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{8,30}$/'],
            'job_title' => ['nullable', 'string', 'max:100'],
            'company_name' => ['required', 'string', 'max:150'],
            'industry_id' => ['nullable', 'integer', Rule::exists('industries', 'id')],
            'company_size' => ['nullable', Rule::enum(CompanySize::class)],
            'problem_area' => ['required', Rule::enum(BusinessFunction::class)],
            'problem_description' => ['required', 'string', 'min:20', 'max:3000'],
            'timeline' => ['nullable', Rule::enum(ProjectTimeline::class)],
            'budget_range' => ['nullable', Rule::enum(BudgetRange::class)],
            'source_page' => ['nullable', 'string', 'max:255'],
            'utm' => ['nullable', 'array:source,medium,campaign,term,content'],
            'utm.*' => ['nullable', 'string', 'max:100'],
            'website' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'Nama lengkap',
            'email' => 'Email kerja',
            'phone' => 'Nomor WhatsApp',
            'job_title' => 'Jabatan',
            'company_name' => 'Nama perusahaan',
            'industry_id' => 'Industri',
            'company_size' => 'Ukuran perusahaan',
            'problem_area' => 'Area masalah',
            'problem_description' => 'Deskripsi masalah',
            'timeline' => 'Target waktu',
            'budget_range' => 'Kisaran budget',
        ];
    }
}
