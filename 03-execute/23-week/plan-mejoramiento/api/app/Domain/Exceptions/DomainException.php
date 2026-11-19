<?php

namespace App\Domain\Exceptions;

/**
 * Base business error. `code` is the stable error code of docs/api-contract.md §2;
 * the message is shown to the user, so it is written in Spanish.
 */
class DomainException extends \DomainException
{
    public function __construct(public readonly string $errorCode, string $message)
    {
        parent::__construct($message);
    }
}
