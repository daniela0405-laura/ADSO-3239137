<?php

use App\Domain\Exceptions\DomainException;
use App\Domain\ValueObjects\DocumentNumber;

it('removes dots, dashes and spaces', function () {
    expect(DocumentNumber::fromString('1.001.001-001')->value)->toBe('1001001001');
});

it('rejects letters or too short documents', function (string $raw) {
    DocumentNumber::fromString($raw);
})->with(['ABC123', '123'])->throws(DomainException::class);
