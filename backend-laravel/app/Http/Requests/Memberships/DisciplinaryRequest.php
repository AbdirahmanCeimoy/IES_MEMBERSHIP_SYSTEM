<?php

namespace App\Http\Requests\Memberships;

use App\Enums\DisciplinaryType;
use App\Http\Requests\BaseNestFormRequest;
use Illuminate\Validation\Rule;

class DisciplinaryRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'type' => ['string', Rule::in(array_column(DisciplinaryType::cases(), 'value'))],
            'reason' => ['string'],
            'endDate' => ['sometimes', 'date'],
        ];
    }

    protected function requiredFields(): array
    {
        return ['type', 'reason'];
    }

    public function messages(): array
    {
        return [
            'type.string' => 'type must be a string',
            'type.in' => 'type must be one of the following values: WARNING, SUSPENSION, TERMINATION',
            'reason.string' => 'reason must be a string',
            'endDate.date' => 'endDate must be a valid ISO 8601 date string',
        ];
    }
}
