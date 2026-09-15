<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseNestFormRequest;
use App\Support\AuthValidation;

class FinalizeCredentialsRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'username' => ['string', 'regex:' . AuthValidation::USERNAME_REGEX],
            'fullName' => ['sometimes', 'string', 'min:2'],
            'email' => ['sometimes', 'email', 'regex:' . AuthValidation::GMAIL_EMAIL_REGEX],
            'newPassword' => ['string', 'regex:' . AuthValidation::SECURE_PASSWORD_REGEX],
        ];
    }

    protected function requiredFields(): array
    {
        return ['username', 'newPassword'];
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
            'newPassword.string' => 'newPassword must be a string',
            'newPassword.regex' => AuthValidation::SECURE_PASSWORD_ERROR,
        ];
    }
}
