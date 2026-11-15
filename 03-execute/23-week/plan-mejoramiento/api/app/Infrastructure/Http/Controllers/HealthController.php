<?php

namespace App\Infrastructure\Http\Controllers;

use Illuminate\Http\JsonResponse;

final class HealthController
{
    public function __invoke(): JsonResponse
    {
        return response()->json(['status' => 'ok']);
    }
}
