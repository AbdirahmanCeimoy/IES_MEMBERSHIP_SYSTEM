<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'Event';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'title',
        'type',
        'date',
        'location',
        'cpdHours',
        'description',
        'status',
        'createdBy',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'cpdHours' => 'decimal:2',
        ];
    }
}
