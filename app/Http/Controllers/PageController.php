<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\PostLike;

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

// PageController.php
    public function showProfile()
    {
        $user = auth()->user();
        
        return Inertia::render('Profile/Index', [
            'auth' => [
                'user' => $user
            ],
            'userData' => [
                'posts' => $user->posts()->with(['user', 'comments'])->latest()->get(),
                'comments' => $user->comments()->with(['post.user'])->latest()->get(),
                'likedPosts' => $user->likedPosts()->with(['user', 'comments'])->latest()->get()
            ]
        ]);
    }
}