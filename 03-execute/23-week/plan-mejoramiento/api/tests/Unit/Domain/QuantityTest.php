<?php

use App\Domain\Exceptions\DomainException;
use App\Domain\ValueObjects\Quantity;

it('accepts one or more units', function () {
    expect(Quantity::of(1)->value)->toBe(1)
        ->and(Quantity::of(3)->value)->toBe(3);
});

it('rejects zero and negative units', function (int $value) {
    Quantity::of($value);
})->with([0, -1])->throws(DomainException::class);
