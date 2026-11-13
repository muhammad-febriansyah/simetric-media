<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StoresPublicImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiteSettingRequest;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    use StoresPublicImages;

    /**
     * Show the website settings form.
     */
    public function edit(): Response
    {
        return Inertia::render('admin/settings/website', [
            'settings' => [
                ...SiteSetting::values(),
                ...SiteSetting::fileUrls(),
            ],
        ]);
    }

    /**
     * Save the website settings, replacing or removing uploaded files when requested.
     */
    public function update(SiteSettingRequest $request): RedirectResponse
    {
        $current = SiteSetting::values();
        $values = $request->safe()->except([
            ...SiteSetting::FILE_KEYS,
            ...array_map(fn (string $key): string => 'remove_'.$key, SiteSetting::FILE_KEYS),
        ]);
        $obsoleteFiles = [];

        foreach (SiteSetting::FILE_KEYS as $key) {
            [$path, $previous] = $this->resolveImage($request, $key, $current[$key], 'settings', 'remove_'.$key);
            $values[$key] = $path;
            $obsoleteFiles[] = $previous;
        }

        SiteSetting::store($values);
        $this->deletePublicFiles(...$obsoleteFiles);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengaturan website berhasil disimpan.']);

        return to_route('admin.site-settings.edit');
    }
}
