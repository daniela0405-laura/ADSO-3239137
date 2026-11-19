<?php

use App\Domain\Exceptions\DomainException;
use App\Domain\ValueObjects\DateRange;

it('accepts a range where the end is after the start', function () {
    $range = DateRange::between(new DateTimeImmutable('2026-11-01'), new DateTimeImmutable('2026-11-30'));

    expect($range->contains(new DateTimeImmutable('2026-11-15')))->toBeTrue()
        ->and($range->contains(new DateTimeImmutable('2026-12-01')))->toBeFalse();
});

it('rejects an end date before the start date', function () {
    DateRange::between(new DateTimeImmutable('2026-11-30'), new DateTimeImmutable('2026-11-01'));
})->throws(DomainException::class, 'La fecha final no puede ser anterior a la inicial.');
