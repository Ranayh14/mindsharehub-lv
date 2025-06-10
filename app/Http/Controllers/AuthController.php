<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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

            Log::info('Attempting login', [
                'email' => $request->email
            ]);

            // Login berhasil?
            if (Auth::attempt($credentials)) {
                $user = Auth::user();

                // Cek apakah akun dibanned
                if ($user->is_banned) {
                    Log::warning('Login ditolak: Akun dibanned', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'ban_reason' => $user->ban_reason
                    ]);

                    Auth::logout();
                    return back()->withErrors(['email' => 'Akun Anda telah diblokir: ' . $user->ban_reason]);
                }

                Log::info('Login berhasil', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'roles' => $user->roles
                ]);

                $request->session()->regenerate();

                // Redirect based on role
                if ($user->roles === 'admin') {
                    Log::info('Redirecting admin to admin dashboard');
                    return redirect()->route('admin.dashboard');
                } else {
                    Log::info('Redirecting user to dashboard');
                    return redirect()->route('dashboard');
                }
            }

            Log::warning('Login gagal: Kredensial tidak valid', [
                'email' => $request->email
            ]);

            return back()->withErrors([
                'email' => 'Email atau password salah',
            ]);

        } catch (ValidationException $e) {
            Log::warning('Login gagal: Validasi input tidak valid', [
                'email' => $request->email,
                'errors' => $e->errors()
            ]);

            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'email' => $request->email,
                'exception' => $e
            ]);

            return back()->withErrors([
                'email' => 'Terjadi kesalahan saat login. Silakan coba lagi.',
            ]);
        }
    }



    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
