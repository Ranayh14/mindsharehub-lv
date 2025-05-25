<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiaryController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register'])->name('register.attempt');
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function() {
    Route::apiResource('diaries', DiaryController::class);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user()->only(['id', 'username', 'email', 'roles']));
});
