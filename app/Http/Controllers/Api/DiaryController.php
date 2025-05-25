<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Diary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DiaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();
        $diaries = Diary::where('user_id', $userId)
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($diaries);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $diary = Diary::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($diary, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $diary = Diary::where('user_id', Auth::id())->find($id);

        if (!$diary) {
            return response()->json(['message' => 'Catatan tidak ditemukan'], 404);
        }

        return response()->json($diary);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $diary = Diary::where('user_id', Auth::id())->find($id);

        if (!$diary) {
            return response()->json(['message' => 'Catatan tidak ditemukan'], 404);
        }

        $diary->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($diary);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $diary = Diary::where('user_id', Auth::id())->find($id);

        if (!$diary) {
            return response()->json(['message' => 'Catatan tidak ditemukan'], 404);
        }

        $diary->delete();

        return response()->json(['message' => 'Catatan berhasil dihapus']);
    }
}
