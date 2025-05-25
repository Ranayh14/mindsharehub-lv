<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityManagementController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $users = [];
        $posts = [];
        $selectedUser = null;

        if ($search) {
            $users = User::where('username', 'like', "%{$search}%")
                ->limit(5)
                ->get(['id', 'username']);

            if ($users->isNotEmpty()) {
                $selectedUser = $users->first();
                $posts = Post::where('user_id', $selectedUser->id)
                    ->orderBy('created_at', 'asc')
                    ->get(['id', 'content', 'created_at']);
            }
        }

        return Inertia::render('Admin/CommunityManagement/Index', [
            'users' => $users,
            'posts' => $posts,
            'selectedUser' => $selectedUser,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    public function deletePost(Post $post)
    {
        // Delete related reports first
        $post->reports()->delete();
        
        // Then delete the post
        $post->delete();

        return redirect()->back()->with('success', 'Post deleted successfully');
    }

    public function searchUsers(Request $request)
    {
        $search = $request->input('search');
        
        return User::where('username', 'like', "%{$search}%")
            ->limit(5)
            ->get(['id', 'username']);
    }
} 