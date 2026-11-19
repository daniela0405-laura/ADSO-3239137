<?php

use App\Domain\Exceptions\DomainException;
use App\Domain\ValueObjects\ItemReference;

it('accepts the AAA-0000 format', function () {
    expect(ItemReference::fromString('CAR-0012')->value)->toBe('CAR-0012');
});

it('normalizes spaces and lowercase', function () {
    expect(ItemReference::fromString('  car-0012 ')->value)->toBe('CAR-0012');
});

it('rejects references with the wrong format', function (string $raw) {
    ItemReference::fromString($raw);
})->with(['CAR0012', 'CA-0012', 'CARP-0012', 'CAR-12', ''])->throws(DomainException::class);
