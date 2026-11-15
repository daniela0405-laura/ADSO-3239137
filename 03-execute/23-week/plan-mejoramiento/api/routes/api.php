<?php

use App\Infrastructure\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

// T-01: public health check (api-contract §3.1)
Route::get('/health', HealthController::class);
