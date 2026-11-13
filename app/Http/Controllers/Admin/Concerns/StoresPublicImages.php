<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Upload, replace and remove images kept on the public disk for admin content.
 */
trait StoresPublicImages
{
    /**
     * Resolve the image path after an update: a new upload replaces the current file,
     * the remove flag clears it, otherwise the current path is kept.
     *
     * @return array{0: string|null, 1: string|null} The new path and the old file to delete.
     */
    protected function resolveImage(Request $request, string $field, ?string $currentPath, string $directory, ?string $removeField = null): array
    {
        if ($request->hasFile($field)) {
            return [$request->file($field)->store($directory, 'public'), $currentPath];
        }

        if ($removeField && $request->boolean($removeField)) {
            return [null, $currentPath];
        }

        return [$currentPath, null];
    }

    /**
     * Delete files from the public disk, ignoring empty paths.
     */
    protected function deletePublicFiles(?string ...$paths): void
    {
        $paths = array_values(array_filter($paths));

        if ($paths !== []) {
            Storage::disk('public')->delete($paths);
        }
    }
}
