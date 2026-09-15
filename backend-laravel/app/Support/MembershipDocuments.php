<?php

namespace App\Support;

use App\Enums\DocumentType;
use App\Enums\MembershipGrade;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

final class MembershipDocuments
{
    public const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

    public const FILE_FIELDS = [
        'idOrPassportFileName',
        'passportPhotoFileName',
        'cvFileName',
        'paymentProofFileName',
        'declarationFileName',
        'enrollmentProofFileName',
        'transcriptFileName',
        'degreeFileName',
        'experienceLetterFileName',
        'employerReferenceFileName',
        'projectPortfolioFileName',
        'refereeOneFileName',
        'refereeTwoFileName',
        'fellowNominationFileName',
        'achievementProfileFileName',
    ];

    public const FIELD_TO_DOC_TYPE = [
        'idOrPassportFileName' => DocumentType::ID_OR_PASSPORT,
        'passportPhotoFileName' => DocumentType::PASSPORT_PHOTO,
        'cvFileName' => DocumentType::CV,
        'paymentProofFileName' => DocumentType::PAYMENT_PROOF,
        'declarationFileName' => DocumentType::DECLARATION,
        'enrollmentProofFileName' => DocumentType::ENROLLMENT_PROOF,
        'transcriptFileName' => DocumentType::TRANSCRIPT,
        'degreeFileName' => DocumentType::DEGREE,
        'experienceLetterFileName' => DocumentType::EXPERIENCE_LETTER,
        'employerReferenceFileName' => DocumentType::EMPLOYER_REFERENCE,
        'projectPortfolioFileName' => DocumentType::PROJECT_PORTFOLIO,
        'refereeOneFileName' => DocumentType::REFEREE_ONE,
        'refereeTwoFileName' => DocumentType::REFEREE_TWO,
        'fellowNominationFileName' => DocumentType::FELLOW_NOMINATION,
        'achievementProfileFileName' => DocumentType::ACHIEVEMENT_PROFILE,
    ];

    private const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

    private const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

    private const DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx'];

    private const DOCUMENT_MIME_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    private const ID_OR_PASSPORT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

    private const ID_OR_PASSPORT_MIME_TYPES = [
        'application/pdf',
        'image/jpeg',
        'image/png',
    ];

    public static function uploadRules(): array
    {
        return [
            'idOrPassportFileName' => [
                'allowedExtensions' => self::ID_OR_PASSPORT_EXTENSIONS,
                'allowedMimeTypes' => self::ID_OR_PASSPORT_MIME_TYPES,
                'allowedDescription' => 'PDF, JPG, or PNG',
            ],
            'passportPhotoFileName' => [
                'allowedExtensions' => self::IMAGE_EXTENSIONS,
                'allowedMimeTypes' => self::IMAGE_MIME_TYPES,
                'allowedDescription' => 'JPG or PNG image',
            ],
            'cvFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'paymentProofFileName' => [
                'allowedExtensions' => self::IMAGE_EXTENSIONS,
                'allowedMimeTypes' => self::IMAGE_MIME_TYPES,
                'allowedDescription' => 'JPG or PNG image screenshot',
            ],
            'declarationFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'enrollmentProofFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'transcriptFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'degreeFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'experienceLetterFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'employerReferenceFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'projectPortfolioFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'refereeOneFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'refereeTwoFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'fellowNominationFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
            'achievementProfileFileName' => [
                'allowedExtensions' => self::DOCUMENT_EXTENSIONS,
                'allowedMimeTypes' => self::DOCUMENT_MIME_TYPES,
                'allowedDescription' => 'PDF, DOC, or DOCX',
            ],
        ];
    }

    public static function requiredDocTypesByGrade(MembershipGrade $grade): array
    {
        $docs = [
            DocumentType::ID_OR_PASSPORT,
            DocumentType::PASSPORT_PHOTO,
            DocumentType::CV,
            DocumentType::PAYMENT_PROOF,
            DocumentType::DECLARATION,
        ];

        if ($grade === MembershipGrade::STUDENT) {
            $docs[] = DocumentType::ENROLLMENT_PROOF;
            $docs[] = DocumentType::TRANSCRIPT;
        }

        if (in_array($grade, [MembershipGrade::GRADUATE, MembershipGrade::CORPORATE, MembershipGrade::SENIOR, MembershipGrade::FELLOW], true)) {
            $docs[] = DocumentType::DEGREE;
        }

        if ($grade === MembershipGrade::GRADUATE) {
            $docs[] = DocumentType::TRANSCRIPT;
        }

        if (in_array($grade, [MembershipGrade::CORPORATE, MembershipGrade::SENIOR, MembershipGrade::FELLOW], true)) {
            $docs[] = DocumentType::EXPERIENCE_LETTER;
        }

        if ($grade === MembershipGrade::CORPORATE) {
            $docs[] = DocumentType::EMPLOYER_REFERENCE;
            $docs[] = DocumentType::PROJECT_PORTFOLIO;
        }

        if (in_array($grade, [MembershipGrade::SENIOR, MembershipGrade::FELLOW], true)) {
            $docs[] = DocumentType::REFEREE_ONE;
            $docs[] = DocumentType::REFEREE_TWO;
        }

        if ($grade === MembershipGrade::FELLOW) {
            $docs[] = DocumentType::FELLOW_NOMINATION;
            $docs[] = DocumentType::ACHIEVEMENT_PROFILE;
        }

        return $docs;
    }

    public static function allowedDocTypesByGrade(MembershipGrade $grade): array
    {
        $docs = [
            DocumentType::ID_OR_PASSPORT,
            DocumentType::PASSPORT_PHOTO,
            DocumentType::CV,
            DocumentType::PAYMENT_PROOF,
            DocumentType::DECLARATION,
        ];

        if ($grade === MembershipGrade::STUDENT) {
            $docs[] = DocumentType::ENROLLMENT_PROOF;
            $docs[] = DocumentType::TRANSCRIPT;
        }

        if ($grade === MembershipGrade::GRADUATE) {
            $docs[] = DocumentType::TRANSCRIPT;
            $docs[] = DocumentType::DEGREE;
        }

        if ($grade === MembershipGrade::ASSOCIATE) {
            $docs[] = DocumentType::TRANSCRIPT;
            $docs[] = DocumentType::EXPERIENCE_LETTER;
        }

        if ($grade === MembershipGrade::CORPORATE) {
            $docs[] = DocumentType::DEGREE;
            $docs[] = DocumentType::EXPERIENCE_LETTER;
            $docs[] = DocumentType::EMPLOYER_REFERENCE;
            $docs[] = DocumentType::PROJECT_PORTFOLIO;
        }

        if (in_array($grade, [MembershipGrade::SENIOR, MembershipGrade::FELLOW], true)) {
            $docs[] = DocumentType::DEGREE;
            $docs[] = DocumentType::EXPERIENCE_LETTER;
            $docs[] = DocumentType::REFEREE_ONE;
            $docs[] = DocumentType::REFEREE_TWO;
        }

        if ($grade === MembershipGrade::FELLOW) {
            $docs[] = DocumentType::FELLOW_NOMINATION;
            $docs[] = DocumentType::ACHIEVEMENT_PROFILE;
        }

        return $docs;
    }

    public static function isUploadFieldName(string $fieldName): bool
    {
        return in_array($fieldName, self::FILE_FIELDS, true);
    }

    public static function sanitizeStoredFileName(UploadedFile $file): string
    {
        $originalName = $file->getClientOriginalName();
        $extension = '.' . strtolower($file->getClientOriginalExtension());
        if ($extension === '.') {
            $extension = strtolower((string) strrchr($originalName, '.')) ?: '';
        }

        $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME) ?: '');
        $baseName = Str::limit($baseName, 60, '');

        return now()->getTimestampMs() . '-' . Str::uuid() . '-' . $baseName . $extension;
    }
}
