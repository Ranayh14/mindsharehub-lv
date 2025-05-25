<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Routing\Controller as BaseController;
use App\Notifications\UserBanned;

class UserManagementController extends BaseController
{
    public function __construct()
    {
        $this->middleware(['auth', 'can:admin']);
    }

    public function index()
    {
        $users = User::all();
        return Inertia::render('Admin/UserManagement', [
            'users' => $users
        ]);
    }

    public function banUser(Request $request, $id)
    {
        try {
            Log::info('Ban request received', [
                'user_id' => $id,
                'reason' => $request->reason,
                'request_data' => $request->all()
            ]);

            $request->validate([
                'reason' => 'required|string|max:255'
            ]);

            $user = User::findOrFail($id);

            Log::info('User found', [
                'user' => $user->toArray()
            ]);

            if ($user->roles === 'admin') {
                Log::warning('Attempted to ban admin user', [
                    'user_id' => $id
                ]);
                return back()->with('error', 'Tidak dapat mem-banned admin.');
            }

            $user->update([
                'is_banned' => true,
                'ban_reason' => $request->reason,
                'ban_date' => now()
            ]);

            Log::info('User banned successfully', [
                'user_id' => $id,
                'reason' => $request->reason
            ]);

            // Send notification
            $user->notify(new UserBanned($request->reason));

            return back()->with('success', 'Pengguna berhasil di-banned.');
        } catch (\Exception $e) {
            Log::error('Failed to ban user', [
                'user_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Gagal mem-banned pengguna: ' . $e->getMessage());
        }
    }

    public function unbanUser($id)
    {
        try {
            Log::info('Unban request received', [
                'user_id' => $id
            ]);

            $user = User::findOrFail($id);

            $user->update([
                'is_banned' => false,
                'ban_reason' => null,
                'ban_date' => null
            ]);

            Log::info('User unbanned successfully', [
                'user_id' => $id
            ]);

            return back()->with('success', 'Pengguna berhasil diaktifkan kembali.');
        } catch (\Exception $e) {
            Log::error('Failed to unban user', [
                'user_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Gagal mengaktifkan kembali pengguna: ' . $e->getMessage());
        }
    }
}
