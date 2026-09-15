<?php

namespace App\Http\Requests\Memberships;

use App\Http\Requests\BaseNestFormRequest;

class RenewRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'cpdCredits' => ['integer', 'min:0', 'max:200'],
            'feePaid' => ['boolean'],
            'notes' => ['sometimes', 'string'],
        ];
    }

    protected function requiredFields(): array
    {
        return ['cpdCredits', 'feePaid'];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        $transforms = [];

        if ($this->exists('cpdCredits')) {
            $value = $this->input('cpdCredits');
            $transforms['cpdCredits'] = is_numeric($value) ? (int) $value : $value;
        }

        if ($this->exists('feePaid')) {
            $value = $this->input('feePaid');
            $transforms['feePaid'] = $value === true || $value === 'true';
        }

        if ($transforms !== []) {
            $this->merge($transforms);
        }
    }

    public function messages(): array
    {
        return [
            'cpdCredits.integer' => 'cpdCredits must be an integer number',
            'cpdCredits.min' => 'cpdCredits must not be less than 0',
            'cpdCredits.max' => 'cpdCredits must not be greater than 200',
            'feePaid.boolean' => 'feePaid must be a boolean value',
            'notes.string' => 'notes must be a string',
        ];
    }
}
