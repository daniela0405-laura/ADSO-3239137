<?php

namespace App\Domain\ValueObjects;

use App\Domain\Exceptions\DomainException;
use DateTimeImmutable;

/** Inclusive date range for the report (CA-10.2). */
final class DateRange
{
    private function __construct(
        public readonly DateTimeImmutable $from,
        public readonly DateTimeImmutable $to,
    ) {}

    public static function between(DateTimeImmutable $from, DateTimeImmutable $to): self
    {
        if ($to < $from) {
            throw new DomainException('INVALID_DATE_RANGE', 'La fecha final no puede ser anterior a la inicial.');
        }

        return new self($from, $to);
    }

    public function contains(DateTimeImmutable $instant): bool
    {
        return $instant >= $this->from && $instant <= $this->to;
    }
}
