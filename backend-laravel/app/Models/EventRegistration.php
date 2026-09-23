<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'EventRegistration';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'registeredAt';
    public const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'eventId',
        'userId',
        'registeredAt',
    ];
}
