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
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\TechnicienMiddleware;
use App\Http\Middleware\TechnicalManagerMiddleware;
use App\Http\Middleware\ProjectManagerMiddleware;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('project', ProjectController::class);

    // Corrected "My Tasks" route for technicians
    Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])
        ->middleware(TechnicienMiddleware::class) // Apply the middleware here
        ->name('task.myTasks');

    Route::resource('task', TaskController::class);
    Route::resource('user', UserController::class);

    // Admin Routes
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::resource('user', UserController::class);
        Route::resource('equipement', EquipementController::class);
    });

    // Technical Manager Routes
    Route::middleware([TechnicalManagerMiddleware::class])->group(function () {
        Route::resource('project', ProjectController::class)->only(['index', 'show']);
        Route::resource('task', TaskController::class)->except(['create', 'store', 'destroy']);
        Route::get('/equipement-assignment', [EquipementAssignmentController::class, 'index'])->name('equipement.assignment.index');
        Route::post('/equipement-assignment/assign', [EquipementAssignmentController::class, 'assign'])->name('equipement.assignment.assign');
        Route::post('/equipement-assignment/unassign/{equipement}', [EquipementAssignmentController::class, 'unassign']) ->name('equipement.assignment.unassign');
    });

    // Project Manager Routes
    Route::middleware([ProjectManagerMiddleware::class])->group(function () {
        Route::get('/my-projects', [ProjectController::class, 'myProjects'])
         ->name('project.myProjects')
         ->middleware(ProjectManagerMiddleware::class);
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('equipement', EquipementController::class);
    Route::get('/equipement-assignment', [EquipementAssignmentController::class, 'index'])->name('equipement.assignment.index');
    Route::post('/equipement-assignment/assign', [EquipementAssignmentController::class, 'assign'])->name('equipement.assignment.assign');

    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])
        ->name('notifications.index');
      
});

require __DIR__ . '/auth.php';