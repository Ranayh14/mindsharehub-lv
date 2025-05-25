<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function showRegister()
    {
        return inertia('Auth/Register');
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'email'    => 'required|email|unique:users',
                'password' => 'required|min:8|confirmed',
                'terms'    => 'accepted',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first(),
                'errors'  => $e->errors(),
            ], 422);
        }

        // Cegah registrasi dengan email admin
        if ($request->email === config('admin.email')) {
            return back()->withErrors(['email' => 'Registrasi admin tidak diperbolehkan.']);
        }

        $user = User::create([
            'username' => User::generateUsername(),
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'roles'    => 'user',
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user'    => $user->only(['id', 'username', 'email', 'roles']),
        ], 201);
    }


    public function showLogin()
    {
        return inertia('Auth/Login');
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email'    => 'required|email',
                'password' => 'required',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Input tidak valid',
                'errors'  => $e->errors(),
            ], 422);
        }

        // Login berhasil?
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Cek apakah akun dibanned
            if ($user->is_banned) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Akun Anda telah diblokir: ' . $user->ban_reason,
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil',
                'token'   => $token,
                'user'    => [
                    'id'       => $user->id,
                    'username' => $user->username,
                    'email'    => $user->email,
                    'roles'    => $user->roles,
                ],
                'redirect' => $user->roles === 'admin' 
                    ? route('admin.dashboard', [], false) 
                    : route('dashboard', [], false),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Email atau password salah',
        ], 401);
    }
    
    

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out. Token deleted',
        ], 200);
    }
}
