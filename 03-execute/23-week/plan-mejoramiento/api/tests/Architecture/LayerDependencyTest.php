<?php

// Constitution, articles I and II.
arch('the domain depends on nothing')
    ->expect('App\Domain')
    ->not->toUse(['Illuminate', 'App\Application', 'App\Infrastructure']);

arch('the application layer only knows the domain')
    ->expect('App\Application')
    ->not->toUse(['Illuminate', 'App\Infrastructure']);
