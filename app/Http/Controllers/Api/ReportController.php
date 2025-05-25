<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    /**
     * Store a newly created report in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reportable_id' => 'required|integer',
            'reportable_type' => 'required|string|in:post,comment',
            'reason' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $reportableType = match ($request->reportable_type) {
            'post' => \App\Models\Post::class,
            'comment' => \App\Models\Comment::class,
        };

        // Cek apakah target laporan ada
        $exists = $reportableType::find($request->reportable_id);

        if (!$exists) {
            return response()->json(['message' => 'Data yang dilaporkan tidak ditemukan'], 404);
        }

        $report = Report::create([
            'user_id' => Auth::id(),
            'reportable_id' => $request->reportable_id,
            'reportable_type' => $reportableType,
            'reason' => $request->reason,
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim',
            'report' => $report,
        ], 201);
    }
}
