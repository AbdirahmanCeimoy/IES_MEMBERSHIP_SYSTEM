<?php

namespace App\Models;

use App\Enums\RenewalStatus;
use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Renewal extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'Renewal';

    protected $primaryKey = 'id';

    public const CREATED_AT = null;

    public const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'applicationId',
        'requestedAt',
        'cpdCredits',
        'feePaid',
        'status',
        'decisionNotes',
        'approvedUntil',
    ];

    protected function casts(): array
    {
        return [
            'requestedAt' => 'datetime',
            'cpdCredits' => 'integer',
            'feePaid' => 'boolean',
            'status' => RenewalStatus::class,
            'approvedUntil' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(MembershipApplication::class, 'applicationId', 'id');
    }
}
