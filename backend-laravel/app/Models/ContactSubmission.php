<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'ContactSubmission';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'type',
        'category',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'regNumber',
        'isMember',
        'anonymous',
        'status',
        'adminNotes',
        'ipAddress',
    ];

    protected function casts(): array
    {
        return [
            'isMember' => 'boolean',
            'anonymous' => 'boolean',
            'createdAt' => 'datetime',
            'updatedAt' => 'datetime',
        ];
    }
}
