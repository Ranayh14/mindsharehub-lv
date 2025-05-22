<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageController;

// Dashboard & CRUD
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DiaryController;

/*
|---------------------------------------------------------------------------
| Web Routes
|---------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
|
*/

// Public pages
Route::get('/', fn() => Inertia::render('Home'))->name('home');
Route::get('/help', fn() => Inertia::render('Help'))->name('help');
Route::get('/about', fn() => Inertia::render('AboutUs'))->name('about');

// Guest-only routes
Route::middleware('guest')->group(function () {
    // Registration
    Route::get('/register', [PageController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.attempt');

    // Login
    Route::get('/login', [PageController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
});

// Logout (authenticated users only)
Route::post('/logout', [AuthController::class, 'logout'])
     ->middleware('auth')
     ->name('logout');

// Authenticated routes
Route::middleware('auth')->group(function () {
    // User Dashboard
    Route::get('/admin/dashboard', [PageController::class, 'showAdminDashboard'])->name('admin.dashboard');
    
    Route::get('/dashboard', DashboardController::class)
         ->name('dashboard');

    // Admin Dashboard (optional; requires “admin” gate)
    Route::get('/admin/dashboard', [PageController::class, 'showAdminDashboard'])
         ->can('admin')
         ->name('admin.dashboard');

    Route::get('/diary', [PageController::class, 'showDiary'])->name('diary');
        Route::prefix('api')->group(function() {
        Route::get('/diaries', [DiaryController::class, 'index']);
        Route::post('/diaries', [DiaryController::class, 'store']);
        Route::put('/diaries/{diary}', [DiaryController::class, 'update']);
        Route::delete('/diaries/{diary}', [DiaryController::class, 'destroy']);
    });

    // Post CRUD & Like
    Route::controller(PostController::class)->group(function () {
        Route::post   ('/posts',              'store')     ->name('posts.store');
        Route::delete ('/posts/{post}',       'destroy')   ->name('posts.destroy');
        Route::put    ('/posts/{post}',       'update')    ->name('posts.update');
        Route::post   ('/posts/{post}/like',  'toggleLike')->name('posts.like');
    });

    // Comment CRUD & Like
    Route::controller(CommentController::class)->group(function () {
        Route::post   ('/comments',               'store')     ->name('comments.store');
        Route::put    ('/comments/{comment}',     'update')    ->name('comments.update');
        Route::delete ('/comments/{comment}',     'destroy')   ->name('comments.destroy');
        Route::post   ('/comments/{comment}/like','toggleLike')->name('comments.like');
    });

    // Report post or comment
    Route::post('/reports', [ReportController::class, 'store'])
         ->name('reports.store');
});
