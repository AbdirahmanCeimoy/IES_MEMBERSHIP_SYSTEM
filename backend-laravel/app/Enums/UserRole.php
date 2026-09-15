<?php

namespace App\Enums;

enum UserRole: string
{
    case MEMBER = 'MEMBER';
    case REVIEWER = 'REVIEWER';
    case ADMIN = 'ADMIN';
}
