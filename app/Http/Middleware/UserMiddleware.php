<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            Log::warning('User mencoba mengakses halaman user tanpa login');
            return redirect()->route('login');
        }

        $user = Auth::user();

        if ($user->roles === 'admin') {
            Log::info('Admin mencoba mengakses halaman user', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
            return redirect()->route('admin.dashboard');
        }

        return $next($request);
    }
}
