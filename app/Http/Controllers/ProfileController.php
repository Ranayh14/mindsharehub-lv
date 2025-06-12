<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\PostLike;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function getUserProfile()
    {
        $user = Auth::user();
        return response()->json([
            'user' => $user,
            'posts' => $user->posts()->with(['user', 'comments'])->latest()->get(),
            'comments' => $user->comments()->with(['post', 'post.user'])->latest()->get(),
            'likes' => $user->likedPosts()->with(['user', 'comments'])->latest()->get()
        ]);
    }

    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|string'
        ]);

        $allowed_pp = [];
        for ($i = 1; $i <= 12; $i++) {
            $allowed_pp[] = "pp{$i}.png";
        }

        if (!in_array($request->profile_picture, $allowed_pp)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid profile picture selection'
            ], 400);
        }

        $user = Auth::user();
        $user->profile_picture = $request->profile_picture;
        $user->save();

        return response()->json([
            'status' => 'success', 
            'message' => 'Profile picture updated successfully',
            'profile_picture' => $user->profile_picture
        ]);
    }
}
