<?php

namespace App\Http\Middleware;

use App\Exceptions\NestHttpException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireRoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $auth = $request->attributes->get('auth');
        $userRole = is_array($auth) && isset($auth['role'])
            ? strtoupper(trim((string) $auth['role']))
            : null;
        $normalizedRoles = array_map(
            static fn (string $role): string => strtoupper(trim($role)),
            $roles
        );

        if ($userRole === null) {
            throw NestHttpException::forbidden('Role missing from authenticated user');
        }

        if (! in_array($userRole, $normalizedRoles, true)) {
            throw NestHttpException::forbidden('Insufficient role permissions');
        }

        return $next($request);
    }
}
