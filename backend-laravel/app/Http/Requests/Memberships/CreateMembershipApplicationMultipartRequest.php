<?php

namespace App\Http\Requests\Memberships;

use App\Enums\MembershipGrade;
use App\Http\Requests\BaseNestFormRequest;
use App\Support\AuthValidation;
use App\Support\MembershipDocuments;
use Illuminate\Validation\Rule;

class CreateMembershipApplicationMultipartRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        $fileRules = [];

        foreach (MembershipDocuments::FILE_FIELDS as $field) {
            $fileRules[$field] = ['sometimes'];
        }

        return array_merge([
            'fullName' => ['string'],
            'email' => ['email', 'regex:' . AuthValidation::GMAIL_EMAIL_REGEX],
            'phone' => ['string'],
            'nationalIdNumber' => ['string', 'regex:/^\d{11}$/'],
            'membershipGrade' => ['string', Rule::in(array_column(MembershipGrade::cases(), 'value'))],
            'organizationName' => ['sometimes', 'string'],
            'yearsOfExperience' => ['sometimes', 'integer', 'min:0'],
            'declarationAccepted' => ['boolean'],
            'bio' => ['sometimes', 'string'],
        ], $fileRules);
    }

    protected function requiredFields(): array
    {
        return [
            'fullName',
            'email',
            'phone',
            'nationalIdNumber',
            'membershipGrade',
            'declarationAccepted',
        ];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        $transforms = [];

        if ($this->exists('email')) {
            $transforms['email'] = is_string($this->input('email'))
                ? strtolower(trim((string) $this->input('email')))
                : $this->input('email');
        }

        if ($this->exists('nationalIdNumber')) {
            $transforms['nationalIdNumber'] = is_string($this->input('nationalIdNumber'))
                ? trim((string) $this->input('nationalIdNumber'))
                : $this->input('nationalIdNumber');
        }

        if ($this->exists('yearsOfExperience')) {
            $value = $this->input('yearsOfExperience');
            $transforms['yearsOfExperience'] = $value === '' || $value === null
                ? null
                : (is_numeric($value) ? (int) $value : $value);
        }

        if ($this->exists('declarationAccepted')) {
            $value = $this->input('declarationAccepted');
            $transforms['declarationAccepted'] = $value === true || $value === 'true';
        }

        if ($transforms !== []) {
            $this->merge($transforms);
        }
    }

    public function messages(): array
    {
        return [
            'fullName.string' => 'fullName must be a string',
            'email.email' => 'email must be an email',
            'email.regex' => AuthValidation::GMAIL_EMAIL_ERROR,
            'phone.string' => 'phone must be a string',
            'nationalIdNumber.string' => 'nationalIdNumber must be a string',
            'nationalIdNumber.regex' => 'National ID must be exactly 11 digits.',
            'membershipGrade.string' => 'membershipGrade must be a string',
            'membershipGrade.in' => 'membershipGrade must be one of the following values: STUDENT, GRADUATE, ASSOCIATE, CORPORATE, SENIOR, FELLOW',
            'organizationName.string' => 'organizationName must be a string',
            'yearsOfExperience.integer' => 'yearsOfExperience must be an integer number',
            'yearsOfExperience.min' => 'yearsOfExperience must not be less than 0',
            'declarationAccepted.boolean' => 'declarationAccepted must be a boolean value',
            'bio.string' => 'bio must be a string',
        ];
    }
}
