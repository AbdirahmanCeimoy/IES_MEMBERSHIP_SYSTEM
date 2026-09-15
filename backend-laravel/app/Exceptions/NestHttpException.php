<?php

namespace App\Exceptions;

use RuntimeException;

class NestHttpException extends RuntimeException
{
    private readonly string|array $messagePayload;

    public function __construct(
        private readonly int $status,
        private readonly string $error,
        string|array $message
    ) {
        parent::__construct(is_string($message) ? $message : 'Validation failed.');
        $this->messagePayload = $message;
    }

    public static function badRequest(string|array $message): self
    {
        return new self(400, 'Bad Request', $message);
    }

    public static function unauthorized(string|array $message): self
    {
        return new self(401, 'Unauthorized', $message);
    }

    public static function forbidden(string|array $message): self
    {
        return new self(403, 'Forbidden', $message);
    }

    public static function notFound(string|array $message): self
    {
        return new self(404, 'Not Found', $message);
    }

    public static function internalServerError(string|array $message): self
    {
        return new self(500, 'Internal Server Error', $message);
    }

    public static function serviceUnavailable(string|array $message): self
    {
        return new self(503, 'Service Unavailable', $message);
    }

    public function status(): int
    {
        return $this->status;
    }

    public function toArray(): array
    {
        return [
            'statusCode' => $this->status,
            'message' => $this->messagePayload,
            'error' => $this->error,
        ];
    }
}
