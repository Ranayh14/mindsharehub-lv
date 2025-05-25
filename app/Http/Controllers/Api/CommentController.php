<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource (optional).
     */
    public function index()
    {
        return Comment::with(['user:id,username,profile_picture', 'likedUsers:id'])
                      ->latest()
                      ->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'post_id'   => 'required|exists:posts,id',
            'comment'   => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'post_id'   => $data['post_id'],
            'user_id'   => $request->user()->id,
            'comment'   => $data['comment'],
            'parent_id' => $data['parent_id'] ?? null,
        ]);

        return response()->json($comment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $comment = Comment::with(['user:id,username,profile_picture', 'likedUsers:id'])
                          ->findOrFail($id);

        return response()->json($comment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $comment = Comment::findOrFail($id);
        Gate::authorize('update', $comment);

        $data = $request->validate([
            'comment' => 'required|string|max:2000',
        ]);

        $comment->update($data);

        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $comment = Comment::findOrFail($id);
        Gate::authorize('delete', $comment);

        $comment->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }

    /**
     * Toggle like on a comment.
     */
    public function toggleLike(string $id)
    {
        $comment = Comment::findOrFail($id);
        Gate::authorize('like', $comment);

        $user = request()->user();
        $comment->likedUsers()->toggle($user);

        $likes_count = $comment->likedUsers()->count();

        return response()->json([
            'status' => $comment->likedUsers->contains($user) ? 'liked' : 'unliked',
            'likes_count' => $likes_count,
        ]);
    }
}
