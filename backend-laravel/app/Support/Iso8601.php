<?php

namespace App\Support;

use DateTimeInterface;

final class Iso8601
{
    public static function format(DateTimeInterface $date): string
    {
        return $date->setTimezone(new \DateTimeZone('UTC'))->format('Y-m-d\TH:i:s.v\Z');
    }
}
