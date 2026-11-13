<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StoresPublicImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TeamMemberRequest;
use App\Http\Resources\TeamMemberResource;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    use StoresPublicImages;

    /**
     * List all team members.
     */
    public function index(): Response
    {
        return Inertia::render('admin/team-members/index', [
            'teamMembers' => TeamMemberResource::collection(
                TeamMember::query()->orderBy('sort_order')->orderBy('name')->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/team-members/form', [
            'teamMember' => null,
        ]);
    }

    /**
     * Store a new record.
     */
    public function store(TeamMemberRequest $request): RedirectResponse
    {
        TeamMember::query()->create([
            ...$request->safe()->except(['photo', 'remove_photo']),
            'photo' => $request->file('photo')?->store('team', 'public'),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Anggota tim berhasil ditambahkan.']);

        return to_route('admin.team-members.index');
    }

    /**
     * Show the edit form.
     */
    public function edit(TeamMember $teamMember): Response
    {
        return Inertia::render('admin/team-members/form', [
            'teamMember' => (new TeamMemberResource($teamMember))->resolve(),
        ]);
    }

    /**
     * Update a record.
     */
    public function update(TeamMemberRequest $request, TeamMember $teamMember): RedirectResponse
    {
        [$photo, $previousPhoto] = $this->resolveImage($request, 'photo', $teamMember->photo, 'team', 'remove_photo');

        $teamMember->update([
            ...$request->safe()->except(['photo', 'remove_photo']),
            'photo' => $photo,
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        $this->deletePublicFiles($previousPhoto);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Anggota tim berhasil diperbarui.']);

        return to_route('admin.team-members.index');
    }

    /**
     * Delete a record.
     */
    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->delete();

        $this->deletePublicFiles($teamMember->photo);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Anggota tim berhasil dihapus.']);

        return to_route('admin.team-members.index');
    }
}
