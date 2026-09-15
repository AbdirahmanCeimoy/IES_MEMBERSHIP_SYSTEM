<?php

return [
    'default' => env('CACHE_STORE', 'file'),

    'stores' => [
        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],
        'database' => [
            'driver' => 'database',
            'connection' => env('CACHE_DB_CONNECTION', env('DB_CONNECTION', 'mysql')),
            'table' => env('CACHE_TABLE', 'cache'),
            'lock_connection' => env('CACHE_LOCK_DB_CONNECTION', env('DB_CONNECTION', 'mysql')),
            'lock_table' => env('CACHE_LOCK_TABLE', 'cache_locks'),
        ],
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],
    ],

    'prefix' => env('CACHE_PREFIX', 'ies_backend_laravel_cache'),
];
