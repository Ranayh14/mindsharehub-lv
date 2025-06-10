<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;

class TokenAuth
{
    public function handle(Request $request, Closure $next)
    {
        // Jika request ke login, skip middleware ini
        if ($request->is('login') || $request->is('api/login')) {
            return $next($request);
        }

        // Jika sudah login, langsung lanjutkan
        if (Auth::check()) {
            return $next($request);
        }

        $token = $request->bearerToken()
            ?? $request->cookie('auth_token')
            ?? ($request->hasHeader('Authorization') ? str_replace('Bearer ', '', $request->header('Authorization')) : null);

        if (!$token) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Unauthorized'], 401)
                : redirect()->route('login');
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken || !$accessToken->tokenable) {
            // Hapus token yang tidak valid dari cookie jika ada
            if ($request->hasCookie('auth_token')) {
                cookie()->queue(cookie()->forget('auth_token'));
            }
            return $request->expectsJson()
                ? response()->json(['message' => 'Invalid token'], 401)
                : redirect()->route('login');
        }

        Auth::login($accessToken->tokenable);
        return $next($request);
    }
}
