<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 401);
        }

        $userRole = strtolower(trim((string) $user->role));
        $requiredRole = strtolower(trim((string) $role));

        if ($userRole !== $requiredRole) {
            return response()->json([
                'message' => 'Forbidden.',
                'current_role' => $userRole,
                'required_role' => $requiredRole,
            ], 403);
        }

        return $next($request);
    }
}