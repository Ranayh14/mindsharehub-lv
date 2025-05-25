<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user', 'likedUsers', 'comments')->latest()->get();
        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
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

        return response()->json($post, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with('user', 'likedUsers', 'comments')->findOrFail($id);
        return response()->json($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);
        Gate::authorize('update', $post);

        $data = $request->validate([
            'content' => 'required|string|max:3000',
            'image'   => 'nullable|image|max:4096',
        ]);

        $post->update(['content' => $data['content']]);

        if ($request->file('image')) {
            if ($post->image_path) Storage::disk('public')->delete($post->image_path);
            $path = $request->file('image')->store('uploads', 'public');
            $post->update(['image_path' => $path]);
        }

        return response()->json([
            'content' => $post->content,
            'is_liked' => $post->is_liked,
            'likes_count' => $post->likes_count,
            'total_comments' => $post->total_comments,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);
        Gate::authorize('delete', $post);

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();
        return response()->json(['message' => 'Post deleted successfully.']);
    }

    /**
     * Toggle like for a post.
     */
    public function toggleLike(string $id)
    {
        $post = Post::findOrFail($id);
        $user = request()->user();
        $post->likedUsers()->toggle($user);

        $likes = $post->likedUsers()->count();
        $post->updateQuietly(['likes_count' => $likes]);

        return response()->json([
            'status' => $post->likedUsers()->contains($user) ? 'liked' : 'unliked',
            'likes_count' => $likes,
            'total_comments' => $post->total_comments,
        ]);
    }
}
