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
    case GRAD_TECHNICIAN = 'GRAD_TECHNICIAN';
    case GRAD_TECHNOLOGIST = 'GRAD_TECHNOLOGIST';
}
