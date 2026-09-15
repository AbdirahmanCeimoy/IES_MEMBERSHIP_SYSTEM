<?php

namespace App\Models;

use App\Casts\UserRoleCast;
use App\Enums\UserRole;
use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'User';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';

    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'username',
        'passwordHash',
        'fullName',
        'email',
        'role',
    ];

    protected $hidden = [
        'passwordHash',
    ];

    protected function casts(): array
    {
        return [
            'role' => UserRoleCast::class,
            'createdAt' => 'datetime',
            'updatedAt' => 'datetime',
        ];
    }

    public function getAuthPassword(): string
    {
        return $this->passwordHash;
    }

    public function applications(): HasMany
    {
        return $this->hasMany(MembershipApplication::class, 'applicantId', 'id');
    }
}
