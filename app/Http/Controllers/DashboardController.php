<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function userDashboard(Request $request)
    {
        try {
            $user = Auth::user();

            Log::info('User mengakses dashboard', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $user->roles
            ]);

            $posts = Post::with([
                'user:id,username,profile_picture',
                'likedUsers:id',
                'comments' => fn ($q) => $q->with([
                    'user:id,username,profile_picture',
                    'likedUsers:id',
                ])->latest(),
            ])
            ->withCount('comments')
            ->latest()
            ->paginate(10)
            ->through(fn ($p) => $p->append(['is_liked','created_at_human']));

            return Inertia::render('Dashboard/User', [
                'posts' => $posts,
                'auth' => [
                    'user' => $user
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error di DashboardController: ' . $e->getMessage());
            return redirect()->route('login');
        }
    }
}
