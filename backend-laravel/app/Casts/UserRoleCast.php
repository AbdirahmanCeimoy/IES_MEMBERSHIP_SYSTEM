<?php

namespace App\Casts;

use App\Enums\UserRole;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class UserRoleCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?UserRole
    {
        if ($value === null || $value instanceof UserRole) {
            return $value;
        }

        $normalized = strtoupper(trim((string) $value));

        return $normalized !== '' ? UserRole::from($normalized) : null;
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof UserRole) {
            return $value->value;
        }

        $normalized = strtoupper(trim((string) $value));

        return $normalized !== '' ? UserRole::from($normalized)->value : null;
    }
}
