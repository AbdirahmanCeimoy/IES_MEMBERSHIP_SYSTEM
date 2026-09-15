<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait UsesStringPrimaryKey
{
    protected static function bootUsesStringPrimaryKey(): void
    {
        static::creating(function ($model): void {
            $keyName = $model->getKeyName();

            if (! $model->{$keyName}) {
                $model->{$keyName} = (string) Str::uuid();
            }
        });
    }

    public function getIncrementing(): bool
    {
        return false;
    }

    public function getKeyType(): string
    {
        return 'string';
    }
}
