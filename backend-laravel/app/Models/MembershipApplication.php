<?php

namespace App\Models;

use App\Enums\ApplicationDecision;
use App\Enums\ApplicationStage;
use App\Enums\MembershipGrade;
use App\Models\Concerns\SerializesDatesToUtcIso8601;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipApplication extends Model
{
    use SerializesDatesToUtcIso8601;
    use UsesStringPrimaryKey;

    protected $table = 'MembershipApplication';

    protected $primaryKey = 'id';

    public const CREATED_AT = 'createdAt';

    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'applicantId',
        'fullName',
        'email',
        'phone',
        'nationalIdNumber',
        'membershipGrade',
        'organizationName',
        'yearsOfExperience',
        'declarationAccepted',
        'bio',
        'stage',
        'decision',
        'rejectionReason',
        'registrationNumber',
        'certificateNumber',
        'validUntil',
    ];

    protected function casts(): array
    {
        return [
            'membershipGrade' => MembershipGrade::class,
            'stage' => ApplicationStage::class,
            'decision' => ApplicationDecision::class,
            'declarationAccepted' => 'boolean',
            'yearsOfExperience' => 'integer',
            'createdAt' => 'datetime',
            'updatedAt' => 'datetime',
            'validUntil' => 'datetime',
        ];
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicantId', 'id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(MembershipDocument::class, 'applicationId', 'id');
    }

    public function emailNotifications(): HasMany
    {
        return $this->hasMany(EmailNotificationLog::class, 'applicationId', 'id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ReviewLog::class, 'applicationId', 'id');
    }

    public function renewals(): HasMany
    {
        return $this->hasMany(Renewal::class, 'applicationId', 'id');
    }

    public function disciplinary(): HasMany
    {
        return $this->hasMany(DisciplinaryAction::class, 'applicationId', 'id');
    }
}
