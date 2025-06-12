<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string|max:3000',
            'image'   => 'nullable|image|max:4096',
        ]);
    
        $post = $request->user()->posts()->create(['content' => $data['content']]);
    
        if ($request->file('image')) {
            $path = $request->file('image')->store('uploads', 'public');
            $post->update(['image_path' => $path]);
        }
    
        // Arahkan kembali ke halaman dashboard, bukan ke /posts
        return Inertia::location(route('dashboard'));
    }

    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);
    
        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }
        $post->delete();
    
        // Arahkan kembali ke dashboard setelah menghapus
        return Inertia::location(route('dashboard'));
    }

    public function toggleLike(Post $post)
    {
        try {
            $user = request()->user();
            $post->likedUsers()->toggle($user);

            $isLiked = $post->likedUsers()->where('users.id', $user->id)->exists();
            $likesCount = $post->likedUsers()->count();

            return response()->json([
                'status' => $isLiked ? 'liked' : 'unliked',
                'likes_count' => $likesCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error processing like',
                'error' => $e->getMessage()
            ], 500);
        }
    }
      

    public function update(Request $r, Post $post)
    {
        Gate::authorize('update', $post);
    
        $data = $r->validate([
            'content' => 'required|string|max:3000',
            'image'   => 'nullable|image|max:4096',
        ]);
    
        // Update konten
        $post->update(['content' => $data['content']]);
    
        if ($r->file('image')) {
            if ($post->image_path) Storage::disk('public')->delete($post->image_path);
            $path = $r->file('image')->store('uploads', 'public');
            $post->update(['image_path' => $path]);
        }
    
        // Kembalikan data terbaru sebagai JSON
        return response()->json([
            'content' => $post->content,
            'is_liked' => $post->is_liked,  // Misalnya kita juga ingin mengembalikan status like
            'likes_count' => $post->likedUsers()->count(),
            'total_comments' => $post->total_comments,
        ]);
    }
     
}
