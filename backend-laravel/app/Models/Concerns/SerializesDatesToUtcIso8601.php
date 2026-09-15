<?php

namespace App\Models\Concerns;

use DateTimeInterface;

trait SerializesDatesToUtcIso8601
{
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->setTimezone(new \DateTimeZone('UTC'))->format('Y-m-d\TH:i:s.v\Z');
    }
}
