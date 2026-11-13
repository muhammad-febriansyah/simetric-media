<?php

use App\Models\Article;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
    $this->actingAs($this->admin);
    Storage::fake('public');
});

test('lists published and draft articles', function () {
    Article::factory()->create();
    Article::factory()->draft()->create();

    $this->get(route('admin.articles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/articles/index')
            ->has('articles', 2)
        );
});

test('creates an article written by the signed-in admin', function () {
    $service = Service::factory()->create();

    $this->post(route('admin.articles.store'), [
        'title' => '5 Tanda Perusahaan Siap Digitalisasi',
        'body' => 'Isi artikel.',
        'category' => 'Strategi',
        'service_ids' => [$service->id],
        'cover_image' => UploadedFile::fake()->image('cover.jpg'),
        'is_published' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.articles.index'));

    $article = Article::query()->sole();

    expect($article->slug)->toBe('5-tanda-perusahaan-siap-digitalisasi')
        ->and($article->author_id)->toBe($this->admin->id)
        ->and($article->isPublished())->toBeTrue()
        ->and($article->services()->pluck('services.id')->all())->toBe([$service->id]);

    Storage::disk('public')->assertExists($article->cover_image);
});

test('requires a title and body', function () {
    $this->post(route('admin.articles.store'), [])
        ->assertSessionHasErrors([
            'title' => 'Judul wajib diisi.',
            'body' => 'Isi artikel wajib diisi.',
        ]);
});

test('keeps the original author when another admin edits the article', function () {
    $article = Article::factory()->create(['author_id' => $this->admin->id]);

    $this->actingAs(User::factory()->admin()->create())
        ->put(route('admin.articles.update', $article), [
            'title' => 'Judul baru',
            'slug' => $article->slug,
            'body' => 'Isi baru.',
        ])->assertSessionHasNoErrors();

    expect($article->refresh()->author_id)->toBe($this->admin->id)
        ->and($article->title)->toBe('Judul baru')
        ->and($article->published_at)->toBeNull();
});

test('soft deletes an article', function () {
    $article = Article::factory()->create();

    $this->delete(route('admin.articles.destroy', $article))
        ->assertRedirect(route('admin.articles.index'));

    $this->assertSoftDeleted($article);
});
