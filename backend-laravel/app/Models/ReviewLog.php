<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewLog extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'ReviewLog';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';

    public const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'applicationId',
        'action',
        'notes',
        'performedBy',
        'createdAt',
    ];

    protected function casts(): array
    {
        return [
            'createdAt' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(MembershipApplication::class, 'applicationId', 'id');
    }
}
