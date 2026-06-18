<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 401);
        }

        $userRole = strtolower(trim((string) $user->role));

        // normalize roles
        $roles = array_map(fn($r) => strtolower(trim($r)), $roles);

        if (!in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'Forbidden.',
                'current_role' => $userRole,
                'required_role' => $roles,
            ], 403);
        }

        return $next($request);
    }
}
