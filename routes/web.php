<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EquipementController;
use App\Http\Controllers\EquipementAssignmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\TechnicienMiddleware;
use App\Http\Middleware\TechnicalManagerMiddleware;
use App\Http\Middleware\ProjectManagerMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::redirect('/', '/dashboard');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (accessible to all authenticated users)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::post('/files', [FileController::class, 'store'])->name('file.store');
    Route::delete('/files/{file}', [FileController::class, 'destroy'])->name('file.destroy');
    // Profile (accessible to all authenticated users)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Notifications (accessible to all authenticated users)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    // Technician Routes
    Route::middleware([TechnicienMiddleware::class])->group(function () {
        Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])->name('task.myTasks');
    });

    // Project Manager Routes
    Route::middleware([ProjectManagerMiddleware::class])->group(function () {
        Route::get('/my-projects', [ProjectController::class, 'myProjects'])->name('project.myProjects');
        // A project manager can also view projects they are assigned to
        Route::resource('project', ProjectController::class)->only(['index', 'show']);
        // A project manager can also manage tasks within their projects
        Route::resource('task', TaskController::class);
    });

    // Technical Manager Routes
    Route::middleware([TechnicalManagerMiddleware::class])->group(function () {
        // A technical manager has full access to projects and tasks
        Route::resource('project', ProjectController::class);
        Route::resource('task', TaskController::class);
        Route::get('/equipement-assignment', [EquipementAssignmentController::class, 'index'])->name('equipement.assignment.index');
        Route::post('/equipement-assignment/assign', [EquipementAssignmentController::class, 'assign'])->name('equipement.assignment.assign');
        Route::post('/equipement-assignment/unassign/{equipement}', [EquipementAssignmentController::class, 'unassign'])->name('equipement.assignment.unassign');
        
    });
    
    // Admin Routes
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::resource('user', UserController::class);
        Route::resource('equipement', EquipementController::class);
    });
});

require __DIR__ . '/auth.php';

