<?php

namespace App\Enums;

/**
 * Membership status the portal exposes to members and admins.
 *
 * Values reflect real membership state (not the pending review state, which
 * lives on ApplicationDecision). An admin sets these directly, or they are
 * derived from ApplicationDecision + validUntil when no explicit value has
 * been set on the record.
 */
enum MembershipStatus: string
{
    /** Active membership, all obligations up to date. */
    case GOOD_STANDING = 'GOOD_STANDING';

    /** Active membership but one or more obligations outstanding. */
    case NOT_IN_GOOD_STANDING = 'NOT_IN_GOOD_STANDING';

    /** Temporarily suspended by IES. */
    case SUSPENDED = 'SUSPENDED';

    /** Not active. */
    case INACTIVE = 'INACTIVE';

    /** Application or renewal is under review. */
    case PENDING = 'PENDING';

    /** Membership has expired and has not been renewed. */
    case EXPIRED = 'EXPIRED';

    /** Member has formally resigned from IES. */
    case RESIGNED = 'RESIGNED';

    /** Membership formally terminated per IES rules. */
    case TERMINATED = 'TERMINATED';

    public function label(): string
    {
        return match ($this) {
            self::GOOD_STANDING => 'Good Standing',
            self::NOT_IN_GOOD_STANDING => 'Not in Good Standing',
            self::SUSPENDED => 'Suspended',
            self::INACTIVE => 'Inactive',
            self::PENDING => 'Pending',
            self::EXPIRED => 'Expired',
            self::RESIGNED => 'Resigned',
            self::TERMINATED => 'Terminated',
        };
    }
}
