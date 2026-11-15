<?php

it('returns ok on the public health endpoint', function () {
    $this->getJson('/api/v1/health')
        ->assertOk()
        ->assertExactJson(['status' => 'ok']);
});

it('does not require a token for the health endpoint', function () {
    $this->getJson('/api/v1/health')->assertStatus(200);
});
