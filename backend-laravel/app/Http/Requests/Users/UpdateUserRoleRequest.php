<?php

namespace App\Http\Requests\Users;

use App\Enums\UserRole;
use App\Http\Requests\BaseNestFormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRoleRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'role' => ['string', Rule::in(array_column(UserRole::cases(), 'value'))],
        ];
    }

    protected function requiredFields(): array
    {
        return ['role'];
    }

    public function messages(): array
    {
        return [
            'role.string' => 'role must be a string',
            'role.in' => 'role must be one of the following values: MEMBER, REVIEWER, ADMIN',
        ];
    }
}
