<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;  // Tambahkan ini untuk mengimpor model Post
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CommentController extends Controller
{
    /* ─────────────────── CREATE ─────────────────── */
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

        return Inertia::render('Dashboard/User', [
            'posts' => Post::with([
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
            ->through(fn ($p) => $p->append(['is_liked','created_at_human'])),
        ]);
    }

    /* ─────────────────── UPDATE ─────────────────── */
    public function update(Request $request, Comment $comment)
    {
        Gate::authorize('update', $comment);

        $comment->update(
            $request->validate(['comment' => 'required|string|max:2000'])
        );

        return Inertia::render('Dashboard/User', [
            'posts' => Post::with([
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
            ->through(fn ($p) => $p->append(['is_liked','created_at_human'])),
        ]);
    }

    /* ─────────────────── DELETE ─────────────────── */
    public function destroy(Comment $comment)
    {
        Gate::authorize('delete', $comment);

        $comment->delete();

        return Inertia::render('Dashboard/User', [
            'posts' => Post::with([
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
            ->through(fn ($p) => $p->append(['is_liked','created_at_human'])),
        ]);
    }

    /* ─────────────────── LIKE / UNLIKE ─────────────────── */
    public function toggleLike(Comment $comment)
    {
        Gate::authorize('like', $comment);

        $user = request()->user();
        $comment->likedUsers()->toggle($user);

        $likes_count = $comment->likedUsers()->count();

        return Inertia::render('Dashboard/User', [
            'posts' => Post::with([
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
            ->through(fn ($p) => $p->append(['is_liked','created_at_human'])),
        ]);
    }
}
