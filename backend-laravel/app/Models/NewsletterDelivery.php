<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsletterDelivery extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    public const STATUS_QUEUED = 'queued';
    public const STATUS_SENT = 'sent';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_BOUNCED = 'bounced';
    public const STATUS_FAILED = 'failed';
    public const STATUS_SKIPPED = 'unsubscribed_before_send';

    protected $table = 'NewsletterDelivery';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'newsletterId',
        'subscriberId',
        'email',
        'status',
        'providerMessageId',
        'sentAt',
        'deliveredAt',
        'bouncedAt',
        'failureReason',
        'attempts',
    ];

    protected function casts(): array
    {
        return [
            'sentAt' => 'datetime',
            'deliveredAt' => 'datetime',
            'bouncedAt' => 'datetime',
            'createdAt' => 'datetime',
            'updatedAt' => 'datetime',
            'attempts' => 'integer',
        ];
    }

    public function newsletter(): BelongsTo
    {
        return $this->belongsTo(Newsletter::class, 'newsletterId', 'id');
    }
}
