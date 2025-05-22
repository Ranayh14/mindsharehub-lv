<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function showRegister()
    {
        return inertia('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'email'                  => 'required|email|unique:users',
            'password'               => 'required|min:8|confirmed',
            'terms'                  => 'accepted',
        ]);

        // Cegah registrasi dengan email admin
        if ($request->email === config('admin.email')) {
            return back()->withErrors(['email' => 'Registrasi admin tidak diperbolehkan.']);
        }

        $user = User::create([
            'username'    => User::generateUsername(),
            'email'       => $request->email,
            'password'        => bcrypt($request->password),
            'roles'       => 'user',
        ]);

        return redirect()->route('login')->with('success', 'Registrasi berhasil. Silakan login.');
    }

    public function showLogin()
    {
        return inertia('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);
    
        $email = $request->email;
        $pw    = $request->password;
    
        if ($email === config('admin.email') && $pw === config('admin.password')) {
            // Cari user admin di database
            $admin = User::where('email', $email)->first();
    
            if ($admin) {
                Auth::login($admin);
                return redirect()->route('admin.dashboard');
            }
    
            return back()->withErrors([
                'email' => 'Akun admin tidak ditemukan di database.',
            ]);
        }
    
        if (Auth::attempt(['email' => $email, 'password' => $pw])) {
            $request->session()->regenerate();
    
            return Auth::user()->roles === 'admin'
                ? redirect()->route('admin.dashboard')
                : redirect()->route('dashboard');
        }
    
        return back()->withErrors([
            'email' => 'Email atau password salah',
        ]);
    }
    
    

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect()->route('login');
    }
}
