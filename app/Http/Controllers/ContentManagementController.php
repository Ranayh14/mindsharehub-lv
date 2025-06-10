<?php

namespace App\Http\Controllers;

use App\Models\Content;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Routing\Controller as BaseController;

class ContentManagementController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('can:admin');
    }

    public function index()
    {
        \Log::info('Accessing content management index');

        $contents = Content::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        \Log::info('Contents retrieved:', ['count' => $contents->count()]);

        $mappedContents = $contents->map(function ($content) {
                return [
                    'id' => $content->id,
                    'title' => $content->title,
                    'content' => $content->content,
                    'image_path' => $content->image_path,
                    'is_published' => $content->is_published,
                    'created_at' => $content->created_at,
                    'user' => $content->user ? [
                        'username' => $content->user->username,
                        'email' => $content->user->email
                    ] : null
                ];
            });

        \Log::info('Contents mapped and ready to render');

        return Inertia::render('Admin/ContentManagement/Index', [
            'contents' => $mappedContents
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ContentManagement/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_published' => 'boolean',
            'send_notification' => 'boolean'
        ]);

        $content = new Content();
        $content->user_id = Auth::id();
        $content->title = $validated['title'];
        $content->content = $validated['content'];
        $content->is_published = $validated['is_published'] ?? true;
        $content->send_notification = $validated['send_notification'] ?? true;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('content-images', 'public');
            $content->image_path = $path;
        }

        $content->save();

        if ($content->send_notification) {
            // TODO: Implement notification logic here
        }

        return redirect()->route('admin.content_management')->with('success', 'Content created successfully');
    }

    public function update(Request $request, Content $content)
    {
        \Log::info('Content update request received.');
        \Log::info('Request all:', $request->all());

        $rules = [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_published' => 'boolean',
            'send_notification' => 'boolean'
        ];

        $validated = $request->validate($rules);

        // Handle image upload or removal
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($content->image_path) {
                Storage::disk('public')->delete($content->image_path);
            }
            // Store new image
            $content->image_path = $request->file('image')->store('content-images', 'public');
        } elseif ($request->input('image') === null && $content->image_path) {
            // If image is explicitly set to null from frontend and old image exists, delete it
            Storage::disk('public')->delete($content->image_path);
            $content->image_path = null;
        } elseif (!$request->has('image') && $request->isMethod('PUT')) {
            // If image field is not present in the request (meaning no change from frontend),
            // do nothing with image_path, retain existing one.
        } else {
            // For other cases, if no image is uploaded or explicitly removed, keep existing image_path
            // This handles cases where image input was simply left untouched
        }

        // Remove the 'image' field from validated data before updating the model
        // as 'image' is for file upload, not a database column.
        unset($validated['image']);

        $content->fill($validated);
        $content->save();

        if ($content->send_notification) {
            // TODO: Implement notification logic
        }

        return redirect()->route('admin.content_management')->with('success', 'Content updated successfully');
    }

    public function destroy(Content $content)
    {
        if ($content->image_path) {
            Storage::disk('public')->delete($content->image_path);
        }

        $content->delete();
        return redirect()->route('admin.content_management')->with('success', 'Content deleted successfully');
    }

    public function show(Content $content)
    {
        return Inertia::render('Admin/ContentManagement/Show', [
            'content' => [
                'id' => $content->id,
                'title' => $content->title,
                'content' => $content->content,
                'image_path' => $content->image_path,
                'is_published' => $content->is_published,
                'created_at' => $content->created_at,
                'user' => $content->user ? [
                    'username' => $content->user->username,
                    'email' => $content->user->email
                ] : null
            ]
        ]);
    }

    public function edit(Content $content)
    {
        return Inertia::render('Admin/ContentManagement/Edit', [
            'content' => [
                'id' => $content->id,
                'title' => $content->title,
                'content' => $content->content,
                'image_path' => $content->image_path,
                'is_published' => $content->is_published,
                'send_notification' => $content->send_notification
            ]
        ]);
    }
}
