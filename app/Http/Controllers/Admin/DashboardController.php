<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessFunction;
use App\Enums\LeadStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\ConsultationRequest;
use App\Models\Industry;
use App\Models\Service;
use App\Models\Solution;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard: lead KPIs, lead trends and breakdowns, follow-ups and content status.
     */
    public function __invoke(): Response
    {
        $now = CarbonImmutable::now();
        $statusCounts = ConsultationRequest::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('admin/dashboard', [
            'kpis' => $this->kpis($now, $statusCounts),
            'trend' => [
                'monthly' => $this->monthlyTrend($now),
                'daily' => $this->dailyTrend($now),
            ],
            'leadsByStatus' => collect(LeadStatus::cases())->map(fn (LeadStatus $status): array => [
                ...$status->toOption(),
                'total' => (int) ($statusCounts[$status->value] ?? 0),
            ]),
            'leadsByProblemArea' => $this->leadsByProblemArea(),
            'leadsByIndustry' => $this->leadsByIndustry(),
            'needsAttention' => LeadResource::collection(
                ConsultationRequest::query()
                    ->with(['industry', 'assignee'])
                    ->where('status', LeadStatus::New)
                    ->where(fn ($query) => $query->whereNull('assigned_to')->orWhere('created_at', '<=', $now->subDay()))
                    ->oldest()
                    ->limit(5)
                    ->get(),
            )->resolve(),
            'latestLeads' => LeadResource::collection(
                ConsultationRequest::query()->with(['industry', 'assignee'])->latest()->limit(5)->get(),
            )->resolve(),
            'content' => $this->contentSummary(),
        ]);
    }

    /**
     * Headline numbers with a comparison to the previous period.
     *
     * @param  Collection<string, int>  $statusCounts
     * @return array<string, array{value: int|float, previous?: int|float|null}>
     */
    private function kpis(CarbonInterface $now, Collection $statusCounts): array
    {
        $thisMonthStart = $now->startOfMonth();
        $lastMonthStart = $thisMonthStart->subMonth();
        $leadsThisMonth = ConsultationRequest::query()->where('created_at', '>=', $thisMonthStart)->count();
        $leadsLastMonth = ConsultationRequest::query()
            ->whereBetween('created_at', [$lastMonthStart, $thisMonthStart])
            ->count();

        $won = (int) ($statusCounts[LeadStatus::Won->value] ?? 0);
        $lost = (int) ($statusCounts[LeadStatus::Lost->value] ?? 0);

        return [
            'leadsThisMonth' => ['value' => $leadsThisMonth, 'previous' => $leadsLastMonth],
            'activeLeads' => [
                'value' => (int) $statusCounts->except([LeadStatus::Won->value, LeadStatus::Lost->value])->sum(),
            ],
            'conversionRate' => [
                'value' => $won + $lost > 0 ? round($won / ($won + $lost) * 100, 1) : 0,
                'won' => $won,
                'closed' => $won + $lost,
            ],
            'unassignedLeads' => [
                'value' => ConsultationRequest::query()
                    ->whereNull('assigned_to')
                    ->whereNotIn('status', [LeadStatus::Won, LeadStatus::Lost])
                    ->count(),
            ],
        ];
    }

    /**
     * New leads per month for the last 6 months (including the current month).
     *
     * @return list<array{label: string, total: int}>
     */
    private function monthlyTrend(CarbonInterface $now): array
    {
        $start = $now->startOfMonth()->subMonths(5);
        $counts = ConsultationRequest::query()
            ->where('created_at', '>=', $start)
            ->pluck('created_at')
            ->countBy(fn (CarbonInterface $date): string => $date->format('Y-m'));

        return collect(range(0, 5))
            ->map(function (int $offset) use ($start, $counts): array {
                $month = $start->addMonths($offset);

                return [
                    'label' => $month->translatedFormat('M Y'),
                    'total' => (int) ($counts[$month->format('Y-m')] ?? 0),
                ];
            })
            ->all();
    }

    /**
     * New leads per day for the last 30 days (including today).
     *
     * @return list<array{label: string, total: int}>
     */
    private function dailyTrend(CarbonInterface $now): array
    {
        $start = $now->startOfDay()->subDays(29);
        $counts = ConsultationRequest::query()
            ->where('created_at', '>=', $start)
            ->pluck('created_at')
            ->countBy(fn (CarbonInterface $date): string => $date->format('Y-m-d'));

        return collect(range(0, 29))
            ->map(function (int $offset) use ($start, $counts): array {
                $day = $start->addDays($offset);

                return [
                    'label' => $day->translatedFormat('d M'),
                    'total' => (int) ($counts[$day->format('Y-m-d')] ?? 0),
                ];
            })
            ->all();
    }

    /**
     * Leads per problem area, largest first.
     *
     * @return list<array{label: string, total: int}>
     */
    private function leadsByProblemArea(): array
    {
        $counts = ConsultationRequest::query()
            ->selectRaw('problem_area, count(*) as total')
            ->groupBy('problem_area')
            ->pluck('total', 'problem_area');

        return collect(BusinessFunction::cases())
            ->map(fn (BusinessFunction $area): array => [
                'label' => $area->label(),
                'total' => (int) ($counts[$area->value] ?? 0),
            ])
            ->sortByDesc('total')
            ->values()
            ->all();
    }

    /**
     * Top 5 industries by number of leads; the rest is folded into "Lainnya".
     *
     * @return list<array{label: string, total: int}>
     */
    private function leadsByIndustry(): array
    {
        $counts = ConsultationRequest::query()
            ->selectRaw('industry_id, count(*) as total')
            ->groupBy('industry_id')
            ->pluck('total', 'industry_id');

        $names = Industry::query()->pluck('name', 'id');
        $rows = $counts
            ->map(fn (mixed $total, int|string $industryId): array => [
                'label' => $names[$industryId] ?? 'Tidak disebutkan',
                'total' => (int) $total,
            ])
            ->sortByDesc('total')
            ->values();

        $top = $rows->take(5);
        $otherTotal = $rows->skip(5)->sum('total');

        return $otherTotal > 0
            ? $top->push(['label' => 'Lainnya', 'total' => $otherTotal])->all()
            : $top->all();
    }

    /**
     * Published and draft counts per content type.
     *
     * @return list<array{label: string, published: int, draft: int}>
     */
    private function contentSummary(): array
    {
        return collect([
            'Studi kasus' => CaseStudy::class,
            'Layanan' => Service::class,
            'Solusi' => Solution::class,
            'Industri' => Industry::class,
            'Artikel' => Article::class,
        ])
            ->map(fn (string $model, string $label): array => [
                'label' => $label,
                'published' => $model::query()->published()->count(),
                'draft' => $model::query()->whereNull('published_at')->count(),
            ])
            ->values()
            ->all();
    }
}
