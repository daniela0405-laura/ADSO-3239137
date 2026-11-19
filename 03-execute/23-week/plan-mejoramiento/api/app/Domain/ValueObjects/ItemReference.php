<?php

namespace App\Domain\ValueObjects;

use App\Domain\Exceptions\DomainException;

/** Item reference with format AAA-0000 (CA-03.2). */
final class ItemReference
{
    private function __construct(public readonly string $value) {}

    public static function fromString(string $raw): self
    {
        $value = strtoupper(trim($raw));
        if (preg_match('/^[A-Z]{3}-\d{4}$/', $value) !== 1) {
            throw new DomainException('VALIDATION_ERROR', 'La referencia debe tener el formato AAA-0000, por ejemplo CAR-0012.');
        }

        return new self($value);
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }
}
