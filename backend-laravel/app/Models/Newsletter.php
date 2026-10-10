<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Newsletter extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_QUEUED = 'queued';
    public const STATUS_SENDING = 'sending';
    public const STATUS_SENT = 'sent';
    public const STATUS_PARTIALLY_FAILED = 'partially_failed';
    public const STATUS_FAILED = 'failed';

    protected $table = 'Newsletter';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'subject',
        'previewText',
        'contentHtml',
        'contentText',
        'status',
        'createdBy',
        'recipientCount',
        'acceptedCount',
        'deliveredCount',
        'bouncedCount',
        'failedCount',
        'startedAt',
        'completedAt',
    ];

    protected function casts(): array
    {
        return [
            'startedAt' => 'datetime',
            'completedAt' => 'datetime',
            'createdAt' => 'datetime',
            'updatedAt' => 'datetime',
            'recipientCount' => 'integer',
            'acceptedCount' => 'integer',
            'deliveredCount' => 'integer',
            'bouncedCount' => 'integer',
            'failedCount' => 'integer',
        ];
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(NewsletterDelivery::class, 'newsletterId', 'id');
    }

    public function canSend(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_FAILED], true);
    }
}
