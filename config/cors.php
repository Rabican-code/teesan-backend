<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:34451',
        'http://localhost:8000',
        'https://api.teesan.app',
    ],
    'allowed_origins_patterns' => [
        '/^http:\/\/localhost:\d+$/',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
