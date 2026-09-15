<?php

namespace App\Models;

use App\Enums\EmailNotificationStatus;
use App\Enums\EmailNotificationType;
use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailNotificationLog extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'EmailNotificationLog';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';

    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'applicationId',
        'type',
        'recipientEmail',
        'subject',
        'status',
        'attempts',
        'providerMessageId',
        'errorMessage',
        'sentAt',
    ];

    protected function casts(): array
    {
        return [
            'type' => EmailNotificationType::class,
            'status' => EmailNotificationStatus::class,
            'attempts' => 'integer',
            'sentAt' => 'datetime',
            'createdAt' => 'datetime',
            'updatedAt' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(MembershipApplication::class, 'applicationId', 'id');
    }
}
