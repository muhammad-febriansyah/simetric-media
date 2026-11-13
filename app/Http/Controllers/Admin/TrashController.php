<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StoresPublicImages;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\ConsultationRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TrashController extends Controller
{
    use StoresPublicImages;

    /**
     * Soft-deletable models shown in the trash, keyed by URL type.
     *
     * @var array<string, array{model: class-string<Model>, label: string, title: string}>
     */
    private const TYPES = [
        'lead' => ['model' => ConsultationRequest::class, 'label' => 'Lead', 'title' => 'name'],
        'case-study' => ['model' => CaseStudy::class, 'label' => 'Studi kasus', 'title' => 'title'],
        'article' => ['model' => Article::class, 'label' => 'Artikel', 'title' => 'title'],
    ];

    /**
     * List every soft-deleted record, newest deletion first.
     */
    public function index(): Response
    {
        $items = collect(self::TYPES)
            ->flatMap(fn (array $type, string $key) => $type['model']::onlyTrashed()->get()->map(fn (Model $record): array => [
                'key' => $key.'-'.$record->getKey(),
                'id' => $record->getKey(),
                'type' => $key,
                'type_label' => $type['label'],
                'title' => (string) $record->getAttribute($type['title']),
                'deleted_at' => $record->getAttribute('deleted_at')?->toIso8601String(),
                'deleted_at_label' => $record->getAttribute('deleted_at')?->translatedFormat('d M Y, H:i'),
            ]))
            ->sortByDesc('deleted_at')
            ->values();

        return Inertia::render('admin/trash/index', [
            'items' => $items,
        ]);
    }

    /**
     * Restore a soft-deleted record.
     */
    public function restore(string $type, int $id): RedirectResponse
    {
        $this->findTrashed($type, $id)->restore();

        Inertia::flash('toast', ['type' => 'success', 'message' => self::TYPES[$type]['label'].' berhasil dipulihkan.']);

        return to_route('admin.trash.index');
    }

    /**
     * Permanently delete a soft-deleted record and its uploaded files.
     */
    public function destroy(string $type, int $id): RedirectResponse
    {
        $record = $this->findTrashed($type, $id);

        $files = match (true) {
            $record instanceof CaseStudy => [$record->cover_image, ...$record->images()->pluck('path')->all()],
            $record instanceof Article => [$record->cover_image],
            default => [],
        };

        $record->forceDelete();
        $this->deletePublicFiles(...$files);

        Inertia::flash('toast', ['type' => 'success', 'message' => self::TYPES[$type]['label'].' dihapus permanen.']);

        return to_route('admin.trash.index');
    }

    /**
     * @return ConsultationRequest|CaseStudy|Article
     */
    private function findTrashed(string $type, int $id): Model
    {
        abort_unless(array_key_exists($type, self::TYPES), 404);

        return self::TYPES[$type]['model']::onlyTrashed()->findOrFail($id);
    }
}
