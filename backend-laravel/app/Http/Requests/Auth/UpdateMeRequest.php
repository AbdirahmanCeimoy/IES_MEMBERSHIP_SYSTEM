<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseNestFormRequest;
use App\Support\AuthValidation;

class UpdateMeRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'username' => ['sometimes', 'string', 'regex:' . AuthValidation::USERNAME_REGEX],
            'fullName' => ['sometimes', 'string', 'min:2'],
            'email' => ['sometimes', 'email', 'regex:' . AuthValidation::GMAIL_EMAIL_REGEX],
        ];
    }

    protected function requiredFields(): array
    {
        return [];
    }

    public function messages(): array
    {
        return [
            'username.string' => 'username must be a string',
            'username.regex' => AuthValidation::USERNAME_ERROR,
            'fullName.string' => 'fullName must be a string',
            'fullName.min' => 'fullName must be longer than or equal to 2 characters',
            'email.email' => 'email must be an email',
            'email.regex' => AuthValidation::GMAIL_EMAIL_ERROR,
        ];
    }
}
