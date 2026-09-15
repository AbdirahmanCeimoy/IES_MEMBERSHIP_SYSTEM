<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseNestFormRequest;

class LoginRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        // Accept either a username (3-32 letters/digits) OR an email address.
        return [
            'username' => ['string', 'min:3', 'max:254', 'regex:/^([A-Za-z0-9]{3,32}|[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,})$/'],
            'password' => ['string', 'min:1'],
        ];
    }

    protected function requiredFields(): array
    {
        return ['username', 'password'];
    }

    public function messages(): array
    {
        return [
            'username.string' => 'username must be a string',
            'username.regex' => 'Enter a valid username (3-32 letters/digits) or email address',
            'username.min' => 'username or email is too short',
            'username.max' => 'username or email is too long',
            'password.string' => 'password must be a string',
            'password.min' => 'password must be at least 1 character',
        ];
    }
}
