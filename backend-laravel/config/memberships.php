<?php

$defaultDocumentStorageRoot = trim((string) env('MEMBERSHIP_DOCUMENTS_ROOT', ''));

if ($defaultDocumentStorageRoot === '') {
    $defaultDocumentStorageRoot = base_path('uploads');
}

return [
    'document_storage_root' => $defaultDocumentStorageRoot,
    'legacy_document_storage_roots' => [
        base_path('uploads'),
    ],
];
