<?php

namespace App\Http\Requests;

use App\Exceptions\NestHttpException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

abstract class BaseNestFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    abstract protected function requiredFields(): array;

    protected function prepareForValidation(): void
    {
        $missingRequiredFields = [];

        foreach ($this->requiredFields() as $field) {
            if (! $this->exists($field)) {
                $missingRequiredFields[$field] = null;
            }
        }

        if ($missingRequiredFields !== []) {
            $this->merge($missingRequiredFields);
        }
    }

    protected function allowedFields(): array
    {
        return array_keys($this->rules());
    }

    public function attributes(): array
    {
        return array_combine($this->allowedFields(), $this->allowedFields()) ?: [];
    }

    public function withValidator($validator): void
    {
        $extraFields = array_diff(array_keys($this->all()), $this->allowedFields());

        if ($extraFields === []) {
            return;
        }

        $validator->after(function (Validator $validator) use ($extraFields): void {
            foreach ($extraFields as $field) {
                $validator->errors()->add($field, "property {$field} should not exist");
            }
        });
    }

    protected function failedValidation(Validator $validator): void
    {
        throw NestHttpException::badRequest($validator->errors()->all());
    }
}
