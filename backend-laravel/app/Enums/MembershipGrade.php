<?php

namespace App\Enums;

enum MembershipGrade: string
{
    case STUDENT = 'STUDENT';
    case GRADUATE = 'GRADUATE';
    case ASSOCIATE = 'ASSOCIATE';
    case CORPORATE = 'CORPORATE';
    case SENIOR = 'SENIOR';
    case FELLOW = 'FELLOW';
}
