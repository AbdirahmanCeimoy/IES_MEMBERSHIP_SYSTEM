<?php

namespace App\Http\Requests\Users;

use App\Enums\MembershipGrade;
use App\Http\Requests\BaseNestFormRequest;
use Illuminate\Validation\Rule;

class CreateManualRegisterRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'membershipGrade' => ['string', Rule::in(array_column(MembershipGrade::cases(), 'value'))],
            'phone' => ['string'],
            'nationalIdNumber' => ['string'],
            'organizationName' => ['sometimes', 'string'],
            'yearsOfExperience' => ['sometimes', 'integer', 'min:0'],
            'bio' => ['sometimes', 'string'],
            'notes' => ['sometimes', 'string'],
            'validUntil' => ['sometimes', 'date'],
        ];
    }

    protected function requiredFields(): array
    {
        return ['membershipGrade', 'phone', 'nationalIdNumber'];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        if ($this->exists('yearsOfExperience')) {
            $value = $this->input('yearsOfExperience');
            $this->merge([
                'yearsOfExperience' => $value === '' || $value === null
                    ? null
                    : (is_numeric($value) ? (int) $value : $value),
            ]);
        }
    }

    public function messages(): array
    {
        return [
            'membershipGrade.string' => 'membershipGrade must be a string',
            'membershipGrade.in' => 'membershipGrade must be one of the following values: STUDENT, GRADUATE, ASSOCIATE, CORPORATE, SENIOR, FELLOW',
            'phone.string' => 'phone must be a string',
            'nationalIdNumber.string' => 'nationalIdNumber must be a string',
            'organizationName.string' => 'organizationName must be a string',
            'yearsOfExperience.integer' => 'yearsOfExperience must be an integer number',
            'yearsOfExperience.min' => 'yearsOfExperience must not be less than 0',
            'bio.string' => 'bio must be a string',
            'notes.string' => 'notes must be a string',
            'validUntil.date' => 'validUntil must be a valid ISO 8601 date string',
        ];
    }
}
