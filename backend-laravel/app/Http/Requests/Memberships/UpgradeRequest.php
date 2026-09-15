<?php

namespace App\Http\Requests\Memberships;

use App\Enums\MembershipGrade;
use App\Http\Requests\BaseNestFormRequest;
use Illuminate\Validation\Rule;

class UpgradeRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'membershipGrade' => ['string', Rule::in(array_column(MembershipGrade::cases(), 'value'))],
            'notes' => ['sometimes', 'string'],
        ];
    }

    protected function requiredFields(): array
    {
        return ['membershipGrade'];
    }

    public function messages(): array
    {
        return [
            'membershipGrade.string' => 'membershipGrade must be a string',
            'membershipGrade.in' => 'membershipGrade must be one of the following values: STUDENT, GRADUATE, ASSOCIATE, CORPORATE, SENIOR, FELLOW',
            'notes.string' => 'notes must be a string',
        ];
    }
}
