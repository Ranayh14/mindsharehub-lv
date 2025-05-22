<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
    
        $r->user()->reports()->create($data + ['reported_by' => $r->user()->id]);
    
        return response()->json(['status'=>'success']);
    }
    
}
