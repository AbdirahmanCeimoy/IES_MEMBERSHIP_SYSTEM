<?php

namespace App\Http\Requests\Memberships;

use App\Enums\ApplicationDecision;
use App\Http\Requests\BaseNestFormRequest;
use Illuminate\Validation\Rule;

class DecisionRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'decision' => ['string', Rule::in(array_column(ApplicationDecision::cases(), 'value'))],
            'notes' => ['sometimes', 'string'],
        ];
    }

    protected function requiredFields(): array
    {
        return ['decision'];
    }

    public function messages(): array
    {
        return [
            'decision.string' => 'decision must be a string',
            'decision.in' => 'decision must be one of the following values: PENDING, APPROVED, REJECTED',
            'notes.string' => 'notes must be a string',
        ];
    }
}
