<?php

use App\Support\RichText;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Long content fields now use the rich text editor and are rendered as HTML.
 * Existing plain text is wrapped in paragraphs (and escaped) so it keeps displaying correctly.
 */
return new class extends Migration
{
    /**
     * Rich text columns per table.
     *
     * @var array<string, list<string>>
     */
    private const COLUMNS = [
        'articles' => ['body'],
        'case_studies' => ['challenge', 'assessment', 'recommendation', 'solution'],
        'services' => ['body'],
        'solutions' => ['body'],
        'products' => ['body'],
        'faqs' => ['answer'],
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (self::COLUMNS as $table => $columns) {
            DB::table($table)->select(['id', ...$columns])->orderBy('id')->chunkById(100, function ($rows) use ($table, $columns): void {
                foreach ($rows as $row) {
                    $changes = collect($columns)
                        ->mapWithKeys(fn (string $column): array => [$column => RichText::fromPlainText($row->{$column})])
                        ->filter(fn (?string $html, string $column): bool => $html !== $row->{$column})
                        ->all();

                    if ($changes !== []) {
                        DB::table($table)->where('id', $row->id)->update($changes);
                    }
                }
            });
        }
    }

    /**
     * Reverse the migrations. The HTML is kept: it still reads correctly and stripping it would lose formatting.
     */
    public function down(): void
    {
        //
    }
};
