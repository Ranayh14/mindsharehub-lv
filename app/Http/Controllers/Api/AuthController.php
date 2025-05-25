<?php

namespace App\Http\Controllers;

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
                'email'                  => 'required|email|unique:users',
                'password'               => 'required|min:8|confirmed',
                'terms'                  => 'accepted',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first(),
                'errors' => $e->errors(),
            ], 422);
        }

        // Cegah registrasi dengan email admin
        if ($request->email === config('admin.email')) {
            return back()->withErrors(['email' => 'Registrasi admin tidak diperbolehkan.']);
        }

        $user = User::create([
            'username'    => User::generateUsername(),
            'email'       => $request->email,
            'password'    => bcrypt($request->password),
            'roles'       => 'user',
        ]);

        return response()->json([
            'message' => 'User registered successfully',
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
                'message' => 'Input is not valid',
                'errors'  => $e->errors(),
            ], 422);
        }

        $email = $credentials['email'];
        $password = $credentials['password'];

        // Cek kredensial admin dari config
        if ($email === config('admin.email') && $password === config('admin.password')) {
            $admin = User::where('email', $email)->first();

            if ($admin) {
                Auth::login($admin);
                $token = $admin->createToken('api_token')->plainTextToken;

                return response()->json([
                    'success' => true,
                    'message' => 'Admin login successful',
                    'token'   => $token,
                    'user'    => $admin,
                    'redirect' => route('admin.dashboard')
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Admin account not found in the database.',
            ], 404);
        }

        // Login untuk user biasa dan admin dari database
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('api_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token'   => $token,
                'user'    => $user,
                'redirect' => $user->roles === 'admin' ? route('admin.dashboard') : route('dashboard'),
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
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
