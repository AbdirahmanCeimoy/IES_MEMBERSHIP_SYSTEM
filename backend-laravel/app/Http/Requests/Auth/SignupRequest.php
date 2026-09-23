<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseNestFormRequest;
use App\Support\AuthValidation;

class SignupRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'username' => ['string', 'regex:' . AuthValidation::USERNAME_REGEX],
            'password' => ['string', 'regex:' . AuthValidation::SECURE_PASSWORD_REGEX],
            'fullName' => ['string'],
            'email' => ['email', 'regex:' . AuthValidation::GMAIL_EMAIL_REGEX],
            'grade' => ['sometimes', 'nullable', 'string', 'in:STUDENT,GRADUATE,ASSOCIATE,CORPORATE,SENIOR,FELLOW'],
        ];
    }

    protected function requiredFields(): array
    {
        return ['username', 'password', 'fullName', 'email'];
    }

    public function messages(): array
    {
        return [
            'username.string' => 'username must be a string',
            'username.regex' => AuthValidation::USERNAME_ERROR,
            'password.string' => 'password must be a string',
            'password.regex' => AuthValidation::SECURE_PASSWORD_ERROR,
            'fullName.string' => 'fullName must be a string',
            'email.email' => 'email must be an email',
            'email.regex' => AuthValidation::GMAIL_EMAIL_ERROR,
        ];
    }
}
