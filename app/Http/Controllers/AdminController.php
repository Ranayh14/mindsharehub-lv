<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\Report;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Notification;

class AdminController extends Controller
{
    public function index()
    {
        // Get total users
        $totalPengguna = User::count();

        // Get new users this month
        $totalPenggunaBaru = User::whereMonth('created_at', Carbon::now()->month)->count();

        // Get pending reports
        $totalWaitingReports = Report::where('status', 'pending')->count();

        // Get solved issues
        $totalSolvedIssues = Report::where('status', 'resolved')->count();

        // Get monthly posts data
        $monthlyPosts = Post::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
        ->whereYear('created_at', Carbon::now()->year)
        ->groupBy('month')
        ->pluck('count', 'month')
        ->toArray();

        // Fill in missing months with 0
        $monthlyPostsData = array_fill(1, 12, 0);
        foreach ($monthlyPosts as $month => $count) {
            $monthlyPostsData[$month] = $count;
        }

        // Get monthly users data
        $monthlyUsers = User::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
        ->whereYear('created_at', Carbon::now()->year)
        ->groupBy('month')
        ->pluck('count', 'month')
        ->toArray();

        // Fill in missing months with 0
        $monthlyUsersData = array_fill(1, 12, 0);
        foreach ($monthlyUsers as $month => $count) {
            $monthlyUsersData[$month] = $count;
        }

        // Get recent posts with user information
        $recentPosts = Post::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'username' => $post->user->username,
                    'created_at' => $post->created_at,
                ];
            });

        return Inertia::render('Admin/Admin', [
            'stats' => [
                'totalPengguna' => $totalPengguna,
                'totalPenggunaBaru' => $totalPenggunaBaru,
                'totalWaitingReports' => $totalWaitingReports,
                'totalSolvedIssues' => $totalSolvedIssues,
                'monthlyPosts' => array_values($monthlyPostsData),
                'monthlyUsers' => array_values($monthlyUsersData),
                'recentPosts' => $recentPosts,
            ],
        ]);
    }

    public function userManagement()
    {
        $users = User::all();
        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
        ]);
    }

    public function communityControl()
    {
        return Inertia::render('Admin/CommunityManagement/index', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function reports()
    {
        return Inertia::render('Admin/Reports');
    }

    public function banUser(Request $request, User $user)
    {
        $user->update([
            'is_banned' => true,
            'ban_reason' => $request->reason,
            'ban_date' => now(),
        ]);
        Log::info('User banned', ['user_id' => $user->id, 'admin_id' => Auth::id(), 'reason' => $request->reason]);
        return redirect()->back()->with('success', 'Pengguna berhasil diblokir.');
    }

    public function unbanUser(User $user)
    {
        $user->update([
            'is_banned' => false,
            'ban_reason' => null,
            'ban_date' => null,
        ]);
        Log::info('User unbanned', ['user_id' => $user->id, 'admin_id' => Auth::id()]);
        return redirect()->back()->with('success', 'Pengguna berhasil diaktifkan kembali.');
    }

    public function createContent()
    {
        return Inertia::render('Admin/ContentManagement/Create');
    }
}
