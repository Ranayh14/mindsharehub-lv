<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, string ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                // Jika user sudah login dan mencoba mengakses halaman login/register,
                // redirect mereka ke dashboard.
                if ($request->routeIs('login') || $request->routeIs('register')) {
                    return redirect()->route('dashboard');
                }
                // Untuk rute lain, biarkan request berlanjut
                return $next($request);
            }
        }

        return $next($request);
    }
}
