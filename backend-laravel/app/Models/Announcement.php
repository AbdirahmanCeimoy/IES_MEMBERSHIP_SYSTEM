<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'Announcement';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';

    public const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'title',
        'body',
        'channel',
        'createdAt',
    ];

    protected function casts(): array
    {
        return [
            'createdAt' => 'datetime',
        ];
    }
}
