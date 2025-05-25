<?php

// namespace App\Http\Middleware;

// use Closure;
// use Illuminate\Http\Request;
// use Laravel\Sanctum\PersonalAccessToken;

// class EnsureTokenIsValid
// {
//     public function handle(Request $request, Closure $next)
//     {
//         $authHeader = $request->header('Authorization');

//         if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
//             return redirect('/login');
//         }

//         $token = str_replace('Bearer ', '', $authHeader);
//         $accessToken = PersonalAccessToken::findToken($token);

//         if (!$accessToken || !$accessToken->tokenable) {
//             return redirect('/login');
//         }

//         auth('web')->login($accessToken->tokenable);

//         return $next($request);
//     }
// }
