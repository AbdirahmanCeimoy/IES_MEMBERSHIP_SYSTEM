<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseNestFormRequest;
use App\Support\AuthValidation;

class UpdateMyPasswordRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'currentPassword' => ['string', 'min:1'],
            'newPassword' => ['string', 'regex:' . AuthValidation::SECURE_PASSWORD_REGEX],
        ];
    }

    protected function requiredFields(): array
    {
        return ['currentPassword', 'newPassword'];
    }

    public function messages(): array
    {
        return [
            'currentPassword.string' => 'currentPassword must be a string',
            'currentPassword.min' => 'currentPassword must be longer than or equal to 1 characters',
            'newPassword.string' => 'newPassword must be a string',
            'newPassword.regex' => AuthValidation::SECURE_PASSWORD_ERROR,
        ];
    }
}
