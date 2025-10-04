<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ChecklistItemController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EquipementController;
use App\Http\Controllers\EquipementAssignmentController;
use App\Http\Controllers\EquipmentMaintenanceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MyProjectController;
use App\Http\Controllers\ProjectManagerTaskController;
use App\Http\Controllers\TechnicalManagerTaskController;
use App\Http\Controllers\TechnicianTaskController;
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
    Route::prefix('tasks/{task}/checklists')->name('tasks.checklists.')->group(function () {
        Route::post('/', [ChecklistItemController::class, 'store'])->name('store');
        Route::patch('/{checklistItem}', [ChecklistItemController::class, 'update'])->name('update');
        Route::delete('/{checklistItem}', [ChecklistItemController::class, 'destroy'])->name('destroy');
    });

    // Profile (accessible to all authenticated users)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications (accessible to all authenticated users)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    // Technician Routes
    Route::middleware([TechnicienMiddleware::class])->group(function () {
        Route::get('/my-tasks', [TechnicianTaskController::class, 'index'])->name('technician.tasks.index');
        Route::get('/my-tasks/{task}', [TechnicianTaskController::class, 'show'])
            ->name('technician.tasks.show')
            ->whereNumber('task');
    });

    // Project Manager Routes
    Route::middleware([ProjectManagerMiddleware::class])->group(function () {
        Route::get('/my-projects', [MyProjectController::class, 'index'])->name('my-projects.index');
        Route::get('/my-projects/{project}', [MyProjectController::class, 'show'])
            ->name('my-projects.show')
            ->whereNumber('project');

        Route::resource('tasks', ProjectManagerTaskController::class)
            ->names('project-manager.tasks')
            ->parameters(['tasks' => 'task']);
    });

    // Technical Manager Routes
    Route::middleware([TechnicalManagerMiddleware::class])->group(function () {
        Route::get('/tous-les-taches', [TechnicalManagerTaskController::class, 'index'])->name('technical-manager.tasks.index');
        Route::get('/tous-les-taches/{task}', [TechnicalManagerTaskController::class, 'show'])
            ->name('technical-manager.tasks.show')
            ->whereNumber('task');

        Route::resource('project', ProjectController::class);
        Route::get('/equipement-assignment', [EquipementAssignmentController::class, 'index'])->name('equipement.assignment.index');
        Route::post('/equipement-assignment/assign', [EquipementAssignmentController::class, 'assign'])->name('equipement.assignment.assign');
        Route::post('/equipement-assignment/unassign/{equipement}', [EquipementAssignmentController::class, 'unassign'])->name('equipement.assignment.unassign');
    });

    // Admin Routes
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::resource('user', UserController::class);

        Route::post('equipement/{equipement}/maintenance', [EquipmentMaintenanceController::class, 'store'])
            ->name('equipement.maintenance.store');
        Route::patch('equipement/{equipement}/maintenance/{maintenance}/complete', [EquipmentMaintenanceController::class, 'complete'])
            ->name('equipement.maintenance.complete');
        Route::delete('equipement/{equipement}/maintenance/{maintenance}', [EquipmentMaintenanceController::class, 'destroy'])
            ->name('equipement.maintenance.destroy');

        Route::resource('equipement', EquipementController::class);
    });
});

require __DIR__ . '/auth.php';
