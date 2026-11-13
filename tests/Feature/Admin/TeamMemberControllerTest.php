<?php

use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());
    Storage::fake('public');
});

test('creates a team member with a photo', function () {
    $this->post(route('admin.team-members.store'), [
        'name' => 'Andi Pratama',
        'position' => 'Lead Consultant',
        'photo' => UploadedFile::fake()->image('andi.jpg'),
        'is_active' => '1',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.team-members.index'));

    $member = TeamMember::query()->sole();

    expect($member->is_active)->toBeTrue();
    Storage::disk('public')->assertExists($member->photo);
});

test('requires a name and position', function () {
    $this->post(route('admin.team-members.store'), [])
        ->assertSessionHasErrors([
            'name' => 'Nama wajib diisi.',
            'position' => 'Jabatan wajib diisi.',
        ]);
});

test('removes the photo when requested', function () {
    $photo = UploadedFile::fake()->image('old.jpg')->store('team', 'public');
    $member = TeamMember::factory()->create(['photo' => $photo]);

    $this->put(route('admin.team-members.update', $member), [
        'name' => $member->name,
        'position' => $member->position,
        'remove_photo' => '1',
    ])->assertSessionHasNoErrors();

    expect($member->refresh()->photo)->toBeNull();
    Storage::disk('public')->assertMissing($photo);
});

test('deletes a team member and the photo file', function () {
    $photo = UploadedFile::fake()->image('photo.jpg')->store('team', 'public');
    $member = TeamMember::factory()->create(['photo' => $photo]);

    $this->delete(route('admin.team-members.destroy', $member))
        ->assertRedirect(route('admin.team-members.index'));

    $this->assertModelMissing($member);
    Storage::disk('public')->assertMissing($photo);
});
