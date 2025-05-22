<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function showLogin()
    {
        return inertia('Auth/Login');  // Render Login page using InertiaJS
    }

    public function showRegister()
    {
        return inertia('Auth/Register');  // Render Register page using InertiaJS
    }

    public function showDashboard()
    {
        return inertia('Dashboard/User');  // Render User Dashboard page using InertiaJS
    }

    public function showAdminDashboard()
    {
        return inertia('Dashboard/Admin');  // Render Admin Dashboard page using InertiaJS
    }

    public function showDiary()
    {
        return Inertia::render('Diary'); // Render halaman Diary menggunakan InertiaJS
    }
}
