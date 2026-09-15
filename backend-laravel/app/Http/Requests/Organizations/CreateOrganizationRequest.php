<?php

namespace App\Http\Requests\Organizations;

use App\Http\Requests\BaseNestFormRequest;
use Closure;

class CreateOrganizationRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'organizationName' => ['string'],
            'organizationType' => ['string'],
            'registrationNumber' => ['string'],
            'contactPerson' => ['string'],
            'contactEmail' => ['email'],
            'contactPhone' => ['string'],
            'legalStatusConfirmed' => [
                static function (string $attribute, mixed $value, Closure $fail): void {
                    if (! is_bool($value)) {
                        $fail('legalStatusConfirmed must be a boolean value');
                    }
                },
            ],
        ];
    }

    protected function requiredFields(): array
    {
        return [
            'organizationName',
            'organizationType',
            'registrationNumber',
            'contactPerson',
            'contactEmail',
            'contactPhone',
            'legalStatusConfirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'organizationName.string' => 'organizationName must be a string',
            'organizationType.string' => 'organizationType must be a string',
            'registrationNumber.string' => 'registrationNumber must be a string',
            'contactPerson.string' => 'contactPerson must be a string',
            'contactEmail.email' => 'contactEmail must be an email',
            'contactPhone.string' => 'contactPhone must be a string',
        ];
    }
}
