<?php

namespace App\Http\Controllers\Memberships;

use App\Enums\DocumentType;
use App\Enums\MembershipGrade;
use App\Exceptions\NestHttpException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Memberships\CreateMembershipApplicationMultipartRequest;
use App\Http\Requests\Memberships\DecisionRequest;
use App\Http\Requests\Memberships\DisciplinaryRequest;
use App\Http\Requests\Memberships\RenewRequest;
use App\Http\Requests\Memberships\UpdateStageRequest;
use App\Http\Requests\Memberships\UpgradeRequest;
use App\Services\Memberships\MembershipDocumentStorage;
use App\Services\Memberships\MembershipsService;
use App\Support\MembershipDocuments;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class MembershipsController extends Controller
{
    public function __construct(
        private readonly MembershipsService $membershipsService,
        private readonly MembershipDocumentStorage $membershipDocumentStorage
    ) {
    }

    public function create(CreateMembershipApplicationMultipartRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $documents = [];

        foreach (MembershipDocuments::FILE_FIELDS as $fieldName) {
            $file = $request->file($fieldName);

            if (! $file instanceof UploadedFile) {
                continue;
            }

            $documents[] = [
                'type' => MembershipDocuments::FIELD_TO_DOC_TYPE[$fieldName],
                'fileName' => $this->storeMembershipFile($fieldName, $file),
            ];
        }

        $membershipGrade = MembershipGrade::from($payload['membershipGrade']);
        $requiredDocTypes = MembershipDocuments::requiredDocTypesByGrade($membershipGrade);
        $allowedDocTypes = MembershipDocuments::allowedDocTypesByGrade($membershipGrade);
        $uploadedTypes = array_map(
            static fn (array $doc): DocumentType => $doc['type'],
            $documents
        );
        $disallowedDocTypes = array_values(array_filter(
            $uploadedTypes,
            static fn (DocumentType $type): bool => ! in_array($type, $allowedDocTypes, true)
        ));
        $missing = array_values(array_filter(
            $requiredDocTypes,
            static fn (DocumentType $type): bool => ! in_array($type, $uploadedTypes, true)
        ));

        if ($disallowedDocTypes !== []) {
            throw NestHttpException::badRequest(
                'These documents are not allowed for '
                . $payload['membershipGrade']
                . ': '
                . implode(', ', array_values(array_unique(array_map(
                    static fn (DocumentType $type): string => $type->value,
                    $disallowedDocTypes
                ))))
            );
        }

        if ($membershipGrade === MembershipGrade::ASSOCIATE) {
            $hasTranscript = in_array(DocumentType::TRANSCRIPT, $uploadedTypes, true);
            $hasExperienceLetter = in_array(DocumentType::EXPERIENCE_LETTER, $uploadedTypes, true);

            if (! $hasTranscript && ! $hasExperienceLetter) {
                throw NestHttpException::badRequest(
                    'Associate membership requires transcript/diploma evidence or relevant experience letter.'
                );
            }
        }

        if ($missing !== []) {
            throw NestHttpException::badRequest(
                'Missing required documents: '
                . implode(', ', array_map(static fn (DocumentType $type): string => $type->value, $missing))
            );
        }

        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->createApplication($auth['sub'], [
            'fullName' => $payload['fullName'],
            'email' => $payload['email'],
            'phone' => $payload['phone'],
            'nationalIdNumber' => $payload['nationalIdNumber'],
            'membershipGrade' => $membershipGrade,
            'organizationName' => $payload['organizationName'] ?? null,
            'yearsOfExperience' => $payload['yearsOfExperience'] ?? null,
            'declarationAccepted' => $payload['declarationAccepted'],
            'bio' => $payload['bio'] ?? null,
            'documents' => $documents,
        ]), 201);
    }

    public function list(): JsonResponse
    {
        return response()->json($this->membershipsService->listApplications(), 200);
    }

    public function get(string $id): JsonResponse
    {
        return response()->json($this->membershipsService->getApplication($id), 200);
    }

    public function listOwn(Request $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->listOwnApplications($auth['sub']), 200);
    }

    public function getOwn(string $id, Request $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->getOwnApplication($id, $auth['sub']), 200);
    }

    public function downloadDocument(string $id, string $documentId, Request $request)
    {
        $auth = $request->attributes->get('auth');
        $document = $this->membershipsService->getApplicationDocument($id, $documentId, $auth);
        $safeFileName = basename($document->fileName);
        $fullPath = $this->membershipDocumentStorage->resolveExistingPath($safeFileName);

        if ($fullPath === null) {
            throw NestHttpException::notFound('Document file not found');
        }

        return response()->download($fullPath, $safeFileName, [
            'Cache-Control' => 'private, no-store',
        ]);
    }

    public function removeDocument(string $id, string $documentId): JsonResponse
    {
        return response()->json($this->membershipsService->deleteApplicationDocument($id, $documentId), 200);
    }

    public function setStage(string $id, UpdateStageRequest $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->updateStage($id, $request->validated(), $auth['sub']), 200);
    }

    public function decision(string $id, DecisionRequest $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->setDecision($id, $request->validated(), $auth['sub']), 200);
    }

    public function renew(string $id, RenewRequest $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->renew($id, $request->validated(), $auth['sub']), 201);
    }

    public function upgrade(string $id, UpgradeRequest $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->upgrade($id, $request->validated(), $auth['sub']), 200);
    }

    public function disciplinary(string $id, DisciplinaryRequest $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->addDisciplinary($id, $request->validated(), $auth['sub']), 201);
    }

    public function register(): JsonResponse
    {
        return response()->json($this->membershipsService->officialRegister(), 200);
    }

    public function certificate(string $id, Request $request): JsonResponse
    {
        $auth = $request->attributes->get('auth');

        return response()->json($this->membershipsService->certificateData($id, $auth), 200);
    }

    public function remove(string $id): JsonResponse
    {
        return response()->json($this->membershipsService->deleteApplication($id), 200);
    }

    private function storeMembershipFile(string $fieldName, UploadedFile $file): string
    {
        if (! MembershipDocuments::isUploadFieldName($fieldName)) {
            throw NestHttpException::badRequest("Unexpected file field: {$fieldName}.");
        }

        $rule = MembershipDocuments::uploadRules()[$fieldName];
        $extension = '.' . strtolower($file->getClientOriginalExtension());
        $normalizedMimeType = strtolower(trim((string) $file->getClientMimeType()));
        $hasReliableMimeType = $normalizedMimeType !== '' && $normalizedMimeType !== 'application/octet-stream';

        if (
            ! in_array($extension, $rule['allowedExtensions'], true)
            || ($hasReliableMimeType && ! in_array($normalizedMimeType, $rule['allowedMimeTypes'], true))
        ) {
            throw NestHttpException::badRequest(
                "Invalid file type for {$fieldName}. Allowed: {$rule['allowedDescription']}."
            );
        }

        if ($file->getSize() > MembershipDocuments::MAX_FILE_SIZE_BYTES) {
            throw NestHttpException::badRequest("{$fieldName} file is too large.");
        }

        $storedFileName = MembershipDocuments::sanitizeStoredFileName($file);

        return $this->membershipDocumentStorage->store($file, $storedFileName);
    }
}
