<?php

use App\Models\Article;
use App\Models\Service;
use App\Support\RichText;
use Illuminate\Support\Facades\DB;

test('converts plain text written to a rich text column into escaped paragraphs', function () {
    $service = Service::factory()->create(['body' => "Paragraf satu\nbaris dua <b>\n\nParagraf dua"]);

    expect($service->body)->toBe("<p>Paragraf satu<br>\nbaris dua &lt;b&gt;</p><p>Paragraf dua</p>");
});

test('keeps HTML written to a rich text column unchanged', function () {
    $service = Service::factory()->create(['body' => '<h2>Judul</h2><p>Isi</p>']);

    expect($service->body)->toBe('<h2>Judul</h2><p>Isi</p>');
});

test('the conversion migration wraps existing plain text content in paragraphs', function () {
    $article = Article::factory()->create();
    DB::table('articles')->where('id', $article->id)->update(['body' => "Teks lama\n\nParagraf <dua>"]);
    $html = Article::factory()->create(['body' => '<p>Sudah HTML</p>']);

    $migration = require database_path('migrations/'.collect(scandir(database_path('migrations')))
        ->first(fn (string $file): bool => str_ends_with($file, 'convert_plain_text_content_to_rich_text.php')));
    $migration->up();

    expect(DB::table('articles')->where('id', $article->id)->value('body'))->toBe('<p>Teks lama</p><p>Paragraf &lt;dua&gt;</p>')
        ->and($html->refresh()->body)->toBe('<p>Sudah HTML</p>');
});

test('keeps tables with merged cells and strips unsafe table attributes', function () {
    $html = RichText::sanitize(
        '<table class="MsoTableGrid" style="width:100%" onclick="alert(1)"><tbody><tr><th colspan="2" style="color:red">Paket</th></tr>'
        .'<tr><td rowspan="2" onmouseover="alert(1)"><p>Basic</p></td><td><p>Rp 1 juta</p></td></tr></tbody></table><script>alert(1)</script>'
    );

    expect($html)->toBe('<table><tbody><tr><th colspan="2">Paket</th></tr><tr><td rowspan="2"><p>Basic</p></td><td><p>Rp 1 juta</p></td></tr></tbody></table>');
});

test('keeps content that starts with a table as HTML', function () {
    $table = '<table><tbody><tr><td><p>Isi</p></td></tr></tbody></table>';

    expect(Article::factory()->create(['body' => $table])->body)->toBe($table);
});
