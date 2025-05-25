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
        $token = $request->bearerToken()
            ?? $request->cookie('auth_token')
            ?? ($request->hasHeader('Authorization') ? str_replace('Bearer ', '', $request->header('Authorization')) : null);

        if (!$token) {
            return redirect('/login');
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken || !$accessToken->tokenable) {
            return redirect('/login');
        }

        Auth::login($accessToken->tokenable);

        return $next($request);
    }
}
