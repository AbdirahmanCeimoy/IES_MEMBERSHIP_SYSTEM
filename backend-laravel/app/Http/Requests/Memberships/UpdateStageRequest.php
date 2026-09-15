<?php

namespace App\Http\Requests\Memberships;

use App\Enums\ApplicationStage;
use App\Http\Requests\BaseNestFormRequest;
use Illuminate\Validation\Rule;

class UpdateStageRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'stage' => ['string', Rule::in(array_column(ApplicationStage::cases(), 'value'))],
            'notes' => ['sometimes', 'string'],
        ];
    }

    protected function requiredFields(): array
    {
        return ['stage'];
    }

    public function messages(): array
    {
        return [
            'stage.string' => 'stage must be a string',
            'stage.in' => 'stage must be one of the following values: SUBMITTED, SCREENING, TECHNICAL_REVIEW, GRADE_RECOMMENDED, PAYMENT_PENDING, PAYMENT_CONFIRMED, CERTIFICATE_ISSUED, REGISTERED',
            'notes.string' => 'notes must be a string',
        ];
    }
}
