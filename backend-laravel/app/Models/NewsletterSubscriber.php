<?php

namespace App\Models;

use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    public const STATUS_PENDING = 'pending';
    public const STATUS_SUBSCRIBED = 'subscribed';
    public const STATUS_UNSUBSCRIBED = 'unsubscribed';
    public const STATUS_SUPPRESSED = 'suppressed';

    protected $table = 'NewsletterSubscriber';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'email',
        'status',
        'confirmToken',
        'confirmTokenExpiresAt',
        'emailVerifiedAt',
        'unsubscribeToken',
        'unsubscribedAt',
        'ipAddress',
        'userAgent',
        'source',
    ];

    protected $hidden = [
        'confirmToken',
    ];

    protected function casts(): array
    {
        return [
            'confirmTokenExpiresAt' => 'datetime',
            'emailVerifiedAt' => 'datetime',
            'unsubscribedAt' => 'datetime',
            'createdAt' => 'datetime',
            'updatedAt' => 'datetime',
        ];
    }

    public static function normalizeEmail(string $email): string
    {
        return strtolower(trim($email));
    }

    public static function generateToken(): string
    {
        return Str::random(64);
    }

    public function isConfirmed(): bool
    {
        return $this->status === self::STATUS_SUBSCRIBED && $this->emailVerifiedAt !== null;
    }

    public function isUnsubscribed(): bool
    {
        return $this->status === self::STATUS_UNSUBSCRIBED
            || $this->status === self::STATUS_SUPPRESSED;
    }
}
