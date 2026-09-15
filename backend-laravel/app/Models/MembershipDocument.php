<?php

namespace App\Models;

use App\Enums\DocumentType;
use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipDocument extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'MembershipDocument';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';

    public const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'applicationId',
        'type',
        'fileName',
        'createdAt',
    ];

    protected function casts(): array
    {
        return [
            'type' => DocumentType::class,
            'createdAt' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(MembershipApplication::class, 'applicationId', 'id');
    }
}
