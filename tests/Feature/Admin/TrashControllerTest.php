<?php

use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\CaseStudyImage;
use App\Models\ConsultationRequest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
    Storage::fake('public');
});

test('lists only soft-deleted records', function () {
    ConsultationRequest::factory()->create()->delete();
    Article::factory()->create()->delete();
    CaseStudy::factory()->create();

    $this->get(route('admin.trash.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/trash/index')
            ->has('items', 2)
        );
});

test('restores a deleted lead', function () {
    $lead = ConsultationRequest::factory()->create();
    $lead->delete();

    $this->post(route('admin.trash.restore', ['type' => 'lead', 'id' => $lead->id]))
        ->assertRedirect(route('admin.trash.index'));

    $this->assertNotSoftDeleted($lead);
});

test('permanently deletes a case study and its files', function () {
    $cover = UploadedFile::fake()->image('cover.jpg')->store('case-studies', 'public');
    $galleryPath = UploadedFile::fake()->image('g.jpg')->store('case-studies/gallery', 'public');
    $caseStudy = CaseStudy::factory()->create(['cover_image' => $cover]);
    CaseStudyImage::factory()->for($caseStudy)->create(['path' => $galleryPath]);
    $caseStudy->delete();

    $this->delete(route('admin.trash.destroy', ['type' => 'case-study', 'id' => $caseStudy->id]))
        ->assertRedirect(route('admin.trash.index'));

    $this->assertModelMissing($caseStudy);
    Storage::disk('public')->assertMissing($cover);
    Storage::disk('public')->assertMissing($galleryPath);
});

test('returns 404 for records that are not deleted or unknown types', function () {
    $article = Article::factory()->create();

    $this->post(route('admin.trash.restore', ['type' => 'article', 'id' => $article->id]))->assertNotFound();
    $this->delete(route('admin.trash.destroy', ['type' => 'user', 'id' => 1]))->assertNotFound();
});
