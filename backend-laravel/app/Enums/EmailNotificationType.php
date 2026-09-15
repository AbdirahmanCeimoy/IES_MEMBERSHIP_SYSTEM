<?php

namespace App\Enums;

enum EmailNotificationType: string
{
    case SUBMISSION = 'SUBMISSION';
    case APPROVAL = 'APPROVAL';
    case REJECTION = 'REJECTION';
}
