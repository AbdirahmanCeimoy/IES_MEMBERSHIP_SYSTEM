<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class OrganizationApplication extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'OrganizationApplication';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';

    public const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'organizationName',
        'organizationType',
        'registrationNumber',
        'contactPerson',
        'contactEmail',
        'contactPhone',
        'legalStatusConfirmed',
        'createdAt',
    ];

    protected function casts(): array
    {
        return [
            'legalStatusConfirmed' => 'boolean',
            'createdAt' => 'datetime',
        ];
    }
}
