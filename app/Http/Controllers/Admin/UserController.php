<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * List all user accounts.
     */
    public function index(): Response
    {
        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection(
                User::query()->withCount('assignedLeads')->orderByDesc('is_admin')->orderBy('name')->get(),
            )->resolve(),
        ]);
    }

    /**
     * Show the form for creating an account.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/form', [
            'user' => null,
        ]);
    }

    /**
     * Create an account. Accounts made by an admin are trusted, so the email counts as verified.
     */
    public function store(UserRequest $request): RedirectResponse
    {
        $user = new User($request->safe()->only(['name', 'email', 'password']));
        $user->is_admin = $request->boolean('is_admin');
        $user->email_verified_at = now();
        $user->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengguna berhasil ditambahkan.']);

        return to_route('admin.users.index');
    }

    /**
     * Show the form for editing an account.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/form', [
            'user' => (new UserResource($user))->resolve(),
        ]);
    }

    /**
     * Update an account. The password only changes when a new one is given.
     */
    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $user->fill($request->safe()->only(['name', 'email']));
        $user->is_admin = $request->boolean('is_admin');

        if (filled($request->validated('password'))) {
            $user->password = $request->validated('password');
        }

        $user->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengguna berhasil diperbarui.']);

        return to_route('admin.users.index');
    }

    /**
     * Delete an account. Admins cannot delete their own account here.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Anda tidak bisa menghapus akun Anda sendiri.']);

            return to_route('admin.users.index');
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengguna berhasil dihapus.']);

        return to_route('admin.users.index');
    }
}
