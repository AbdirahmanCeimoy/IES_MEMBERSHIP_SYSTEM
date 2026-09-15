<?php

namespace App\Models;

use App\Enums\DisciplinaryType;
use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisciplinaryAction extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'DisciplinaryAction';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';

    public const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'applicationId',
        'type',
        'reason',
        'startDate',
        'endDate',
        'createdBy',
        'createdAt',
    ];

    protected function casts(): array
    {
        return [
            'type' => DisciplinaryType::class,
            'startDate' => 'datetime',
            'endDate' => 'datetime',
            'createdAt' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(MembershipApplication::class, 'applicationId', 'id');
    }
}
