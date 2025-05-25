<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BanController extends Controller
{
    public function ban(Request $request, $userId)
    {
        try {
            DB::beginTransaction();

            $user = User::findOrFail($userId);

            if ($user->roles === 'admin') {
                return response()->json(['error' => 'Cannot ban admin users'], 403);
            }

            $user->is_banned = true;
            $user->ban_reason = $request->reason;
            $user->ban_date = now();
            $user->save();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'User banned successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to ban user'], 500);
        }
    }

    public function unban($userId)
    {
        try {
            DB::beginTransaction();

            $user = User::findOrFail($userId);
            $user->is_banned = false;
            $user->ban_reason = null;
            $user->ban_date = null;
            $user->save();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'User unbanned successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to unban user'], 500);
        }
    }
}
