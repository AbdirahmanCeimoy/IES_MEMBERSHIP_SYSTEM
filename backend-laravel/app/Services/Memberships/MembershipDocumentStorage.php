<?php

namespace App\Services\Memberships;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class MembershipDocumentStorage
{
    public function store(UploadedFile $file, string $storedFileName): string
    {
        $root = $this->primaryRoot();

        if (! File::isDirectory($root)) {
            File::makeDirectory($root, 0775, true);
        }

        $file->move($root, basename($storedFileName));

        return basename($storedFileName);
    }

    public function resolveExistingPath(string $fileName): ?string
    {
        $safeFileName = basename($fileName);

        foreach ($this->allRoots() as $root) {
            $candidate = $root . DIRECTORY_SEPARATOR . $safeFileName;

            if (File::exists($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    public function delete(string $fileName): void
    {
        $safeFileName = basename($fileName);

        foreach ($this->allRoots() as $root) {
            $candidate = $root . DIRECTORY_SEPARATOR . $safeFileName;

            if (! File::exists($candidate)) {
                continue;
            }

            File::delete($candidate);
        }
    }

    private function primaryRoot(): string
    {
        return $this->normalizeRoot((string) config('memberships.document_storage_root', base_path('uploads')));
    }

    /**
     * @return list<string>
     */
    private function allRoots(): array
    {
        $roots = [$this->primaryRoot()];

        foreach ((array) config('memberships.legacy_document_storage_roots', []) as $root) {
            if (! is_string($root) || trim($root) === '') {
                continue;
            }

            $roots[] = $this->normalizeRoot($root);
        }

        return array_values(array_unique(array_filter($roots, static fn (string $root): bool => $root !== '')));
    }

    private function normalizeRoot(string $root): string
    {
        $trimmed = trim($root);

        if ($trimmed === '') {
            return '';
        }

        return rtrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $trimmed), DIRECTORY_SEPARATOR);
    }
}
