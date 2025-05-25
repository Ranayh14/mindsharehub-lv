<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\CommentReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['reporter', 'reportedUser'])->orderByDesc('created_at')->get();
        $commentReports = CommentReport::with(['user', 'comment'])->orderByDesc('created_at')->get();

        return Inertia::render('Admin/Report', [
            'reports' => $reports,
            'commentReports' => $commentReports,
        ]);
    }
}
