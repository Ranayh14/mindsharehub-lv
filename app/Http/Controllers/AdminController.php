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

class AdminController extends Controller
{
    public function dashboard()
    {
        // Get monthly posts data for the current year
        $monthlyPosts = Post::select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as count'))
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Get monthly users data for the current year
        $monthlyUsers = User::select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as count'))
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Fill in missing months with 0
        $filledMonthlyPosts = array_replace(array_fill(1, 12, 0), $monthlyPosts);
        $filledMonthlyUsers = array_replace(array_fill(1, 12, 0), $monthlyUsers);

        // Get recent posts with user information
        $recentPosts = Post::with(['user' => function($query) {
                $query->select('id', 'username');
            }])
            ->select('id', 'content', 'user_id', 'created_at')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'username' => $post->user ? $post->user->username : 'Unknown User',
                    'created_at' => $post->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $stats = [
            'totalPengguna' => User::count(),
            'totalPenggunaBaru' => User::whereMonth('created_at', date('m'))->count(),
            'totalWaitingReports' => Report::where('status', 'pending')->count(),
            'totalSolvedIssues' => Report::where('status', 'resolved')->count(),
            'monthlyPosts' => array_values($filledMonthlyPosts),
            'monthlyUsers' => array_values($filledMonthlyUsers),
            'recentPosts' => $recentPosts,
        ];

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
        ]);
    }
}
