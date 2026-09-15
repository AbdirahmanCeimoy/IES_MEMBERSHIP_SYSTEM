<?php

namespace App\Services\Organizations;

use App\Exceptions\NestHttpException;
use App\Models\OrganizationApplication;

class OrganizationsService
{
    public function create(array $dto): array
    {
        if (! $dto['legalStatusConfirmed']) {
            throw NestHttpException::badRequest('Legal status confirmation is required.');
        }

        $application = OrganizationApplication::query()->create([
            'organizationName' => $dto['organizationName'],
            'organizationType' => $dto['organizationType'],
            'registrationNumber' => $dto['registrationNumber'],
            'contactPerson' => $dto['contactPerson'],
            'contactEmail' => $dto['contactEmail'],
            'contactPhone' => $dto['contactPhone'],
            'legalStatusConfirmed' => $dto['legalStatusConfirmed'],
        ]);

        return $this->serializeModel($application);
    }

    public function list(): array
    {
        return OrganizationApplication::query()
            ->orderByDesc('createdAt')
            ->get()
            ->map(fn (OrganizationApplication $application): array => $this->serializeModel($application))
            ->all();
    }

    private function serializeModel(OrganizationApplication $model): array
    {
        return json_decode(json_encode($model, JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
    }
}
