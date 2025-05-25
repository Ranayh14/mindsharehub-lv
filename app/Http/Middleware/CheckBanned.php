<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckBanned
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->is_banned) {
            if ($request->route()->getName() !== 'banned') {
                return redirect()->route('banned');
            }
        }

        return $next($request);
    }
}
