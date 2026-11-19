<?php

namespace App\Domain\ValueObjects;

use App\Domain\Exceptions\DomainException;

/** Customer identity document: digits only, 5 to 30 characters (CA-05.1). */
final class DocumentNumber
{
    private function __construct(public readonly string $value) {}

    public static function fromString(string $raw): self
    {
        $value = preg_replace('/[\s.\-]/', '', $raw) ?? '';
        if (preg_match('/^\d{5,30}$/', $value) !== 1) {
            throw new DomainException('VALIDATION_ERROR', 'El documento debe tener solo números, entre 5 y 30 dígitos.');
        }

        return new self($value);
    }
}
