<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Inertia\Inertia;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Content::where('is_published', true)
            ->where('send_notification', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($content) {
                return [
                    'id' => $content->id,
                    'title' => $content->title,
                    'content' => $content->content,
                    'created_at' => $content->formatted_created_at,
                    'image_path' => $content->image_path
                ];
            });

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications
        ]);
    }
}
