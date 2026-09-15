<?php

declare(strict_types=1);

$requestUri = urldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
$publicPath = __DIR__ . '/public';
$requestedFile = realpath($publicPath . $requestUri);

if ($requestedFile !== false && str_starts_with($requestedFile, realpath($publicPath) ?: $publicPath) && is_file($requestedFile)) {
    $mimeType = function_exists('mime_content_type') ? mime_content_type($requestedFile) : null;
    if (is_string($mimeType) && $mimeType !== '') {
        header('Content-Type: ' . $mimeType);
    }

    readfile($requestedFile);
    return true;
}

require $publicPath . '/index.php';
