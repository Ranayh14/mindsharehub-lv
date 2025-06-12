<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function store(Request $r)
    {
        $data = $r->validate([
            'post_id'    => 'nullable|required_without:comment_id|exists:posts,id',
            'comment_id' => 'nullable|required_without:post_id|exists:comments,id',
            'reason'     => 'required|string|max:50',
            'description'=> 'required|string|max:2000',
        ]);

        // Buat array data untuk report
        $reportData = [
            'reason' => $data['reason'],
            'description' => $data['description'],
            'reported_by' => $r->user()->id,
            'status' => 'pending'
        ];

        // Tambahkan post_id atau comment_id sesuai yang dikirim
        if (isset($data['post_id'])) {
            $reportData['post_id'] = $data['post_id'];
        }
        if (isset($data['comment_id'])) {
            $reportData['comment_id'] = $data['comment_id'];
        }

        Report::create($reportData);
    
        if ($r->wantsJson()) {
            return response()->json(['status' => 'success']);
        }

        return back()->with('success', 'Laporan berhasil dikirim');
    }
}
