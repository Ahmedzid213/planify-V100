<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EquipementController;
use App\Http\Controllers\EquipementAssignmentController;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('project', ProjectController::class);
    Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])
        ->name('task.myTasks');
    Route::resource('task', TaskController::class);
    Route::resource('user', UserController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::resource('equipement', EquipementController::class);
Route::get('/equipement-assignment', [EquipementAssignmentController::class, 'index'])->name('equipement.assignment.index');
    Route::post('/equipement-assignment/assign', [EquipementAssignmentController::class, 'assign'])->name('equipement.assignment.assign');
Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('notifications.index');
require __DIR__ . '/auth.php';
