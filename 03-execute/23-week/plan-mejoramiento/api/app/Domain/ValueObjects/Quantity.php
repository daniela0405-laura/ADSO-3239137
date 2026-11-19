<?php

namespace App\Domain\ValueObjects;

use App\Domain\Exceptions\DomainException;

/** Total units of an item: always 1 or more (CA-03.3). */
final class Quantity
{
    private function __construct(public readonly int $value) {}

    public static function of(int $value): self
    {
        if ($value < 1) {
            throw new DomainException('VALIDATION_ERROR', 'El total de unidades debe ser 1 o más.');
        }

        return new self($value);
    }
}
