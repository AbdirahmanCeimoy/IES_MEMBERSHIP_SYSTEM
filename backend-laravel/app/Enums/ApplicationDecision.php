<?php

namespace App\Enums;

enum ApplicationDecision: string
{
    case PENDING = 'PENDING';
    case APPROVED = 'APPROVED';
    case REJECTED = 'REJECTED';
}
