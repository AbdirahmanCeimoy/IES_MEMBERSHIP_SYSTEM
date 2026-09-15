<?php

namespace App\Http\Requests\Users;

use App\Enums\UserRole;
use App\Http\Requests\BaseNestFormRequest;
use App\Support\AuthValidation;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'username' => ['sometimes', 'string', 'regex:' . AuthValidation::USERNAME_REGEX],
            'fullName' => ['sometimes', 'string', 'min:2'],
            'email' => ['sometimes', 'email', 'regex:' . AuthValidation::GMAIL_EMAIL_REGEX],
            'role' => ['sometimes', 'string', Rule::in(array_column(UserRole::cases(), 'value'))],
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
            'role.string' => 'role must be a string',
            'role.in' => 'role must be one of the following values: MEMBER, REVIEWER, ADMIN',
        ];
    }
}
