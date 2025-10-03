<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TechnicalManagerTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Task::with(['project.manager', 'assignedUser', 'createdBy', 'updatedBy'])
            ->where(function ($builder) {
                $builder
                    ->whereHas('assignedUser', function ($userQuery) {
                        $userQuery->whereIn('role', ['technicien', 'project manager']);
                    })
                    ->orWhereHas('project.manager', function ($managerQuery) {
                        $managerQuery->where('role', 'project manager');
                    });
            });

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        if ($request->filled('assigned_user_id')) {
            $query->where('assigned_user_id', $request->input('assigned_user_id'));
        }

        if ($request->filled('project_manager_id')) {
            $query->whereHas('project', function ($projectQuery) use ($request) {
                $projectQuery->where('project_manager_id', $request->input('project_manager_id'));
            });
        }

        $tasks = $query
            ->orderBy($request->input('sort_field', 'created_at'), $request->input('sort_direction', 'desc'))
            ->paginate(10)
            ->withQueryString();

        $technicians = User::query()
            ->where('role', 'technicien')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $projectManagers = User::query()
            ->where('role', 'project manager')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('TechnicalManagerTasks/Index', [
            'tasks' => TaskResource::collection($tasks),
            'filters' => $request->only([
                'name',
                'status',
                'priority',
                'assigned_user_id',
                'project_manager_id',
                'sort_field',
                'sort_direction',
            ]),
            'technicians' => $technicians->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
            ]),
            'projectManagers' => $projectManagers->map(fn ($manager) => [
                'id' => $manager->id,
                'name' => $manager->name,
            ]),
        ]);
    }

    public function show(Task $task): Response
    {
        $task->load(['project.manager', 'assignedUser', 'createdBy', 'updatedBy']);

        $isVisible = false;

        if ($task->assignedUser && in_array($task->assignedUser->role, ['technicien', 'project manager'])) {
            $isVisible = true;
        }

        if ($task->project && $task->project->manager && $task->project->manager->role === 'project manager') {
            $isVisible = true;
        }

        abort_if(! $isVisible, 404);

        return Inertia::render('TechnicalManagerTasks/Show', [
            'task' => new TaskResource($task),
        ]);
    }
}
