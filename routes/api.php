<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\DiaryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
|
*/

// Guest routes (No auth middleware)
Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('api.register');
    Route::post('/login', [AuthController::class, 'login'])->name('api.login');
});

// Authenticated routes (Require sanctum token or similar)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Illuminate\Http\Request $request) {
        return $request->user();
    })->name('api.user');

    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    // Post routes
    Route::apiResource('posts', PostController::class)->only(['store', 'update', 'destroy', 'index', 'show']);
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike'])->name('api.posts.like');

    // Comment routes
    Route::apiResource('comments', CommentController::class)->only(['store', 'update', 'destroy', 'index', 'show']);
    Route::post('/comments/{comment}/like', [CommentController::class, 'toggleLike'])->name('api.comments.like');

    // Report routes
    // Route::post('/reports', [ReportController::class, 'store'])->name('api.reports.store');

    // Diary routes
    Route::apiResource('diaries', DiaryController::class)->only(['index', 'store', 'update', 'destroy']);
});
