<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Notification;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectManagerTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Task::with(['project.manager', 'assignedUser', 'createdBy', 'updatedBy'])
            ->whereHas('project', function ($builder) use ($user) {
                $builder->where('project_manager_id', $user->id);
            });

        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        $tasks = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ProjectManagerTasks/Index', [
            'tasks' => TaskResource::collection($tasks),
            'filters' => $request->only(['name', 'status', 'priority', 'sort_field', 'sort_direction']),
            'success' => session('success'),
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();

        $projects = Project::query()
            ->where('project_manager_id', $user->id)
            ->orderBy('name')
            ->get();

        $technicians = User::query()
            ->where('role', 'technicien')
            ->orderBy('name')
            ->get();

        return Inertia::render('ProjectManagerTasks/Create', [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($technicians),
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $managerId = $request->user()->id;

        $this->assertProjectBelongsToManager($data['project_id'], $managerId);

        $file = $data['image'] ?? null;
        $data['created_by'] = $managerId;
        $data['updated_by'] = $managerId;

        if ($file) {
            $data['image_path'] = $file->store('task/' . Str::random(), 'public');
        }

        $task = Task::create($data);

        Notification::create([
            'user_id' => $managerId,
            'type' => 'new_task',
            'data' => [
                'task_id' => $task->id,
                'task_name' => $task->name,
            ],
        ]);

        if ($task->assigned_user_id && $task->assigned_user_id !== $managerId) {
            $task->load('project');

            Notification::create([
                'user_id' => $task->assigned_user_id,
                'type' => 'task_assigned',
                'data' => [
                    'task_id' => $task->id,
                    'task_name' => $task->name,
                    'project_name' => optional($task->project)->name,
                ],
            ]);
        }


        return to_route('project-manager.tasks.index')
            ->with('success', 'Task was created');
    }

    public function show(Request $request, Task $task): Response
    {
        $this->ensureTaskBelongsToManager($task, $request->user()->id);

        $task->load([
            'project.manager',
            'assignedUser',
            'createdBy',
            'updatedBy',
            'checklists' => fn ($query) => $query->orderBy('created_at'),
        ]);

        return Inertia::render('ProjectManagerTasks/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    public function edit(Request $request, Task $task): Response
    {
        $managerId = $request->user()->id;
        $this->ensureTaskBelongsToManager($task, $managerId);

        $projects = Project::query()
            ->where('project_manager_id', $managerId)
            ->orderBy('name')
            ->get();

        $technicians = User::query()
            ->where('role', 'technicien')
            ->orderBy('name')
            ->get();

        $task->load(['project', 'assignedUser']);

        return Inertia::render('ProjectManagerTasks/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($technicians),
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $managerId = $request->user()->id;
        $this->ensureTaskBelongsToManager($task, $managerId);

        $data = $request->validated();
        $file = $data['image'] ?? null;
        $data['updated_by'] = $managerId;
        $previousAssignedUserId = $task->assigned_user_id;

        if ($file) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $file->store('task/' . Str::random(), 'public');
        }

        $this->assertProjectBelongsToManager($data['project_id'], $managerId);

        $task->update($data);
        $task->load('project');

        if (array_key_exists('assigned_user_id', $data) && (int) $data['assigned_user_id'] !== (int) $previousAssignedUserId) {
            Notification::create([
                'user_id' => $task->assigned_user_id,
                'type' => 'task_assigned',
                'data' => [
                    'task_id' => $task->id,
                    'task_name' => $task->name,
                    'project_name' => optional($task->project)->name,
                ],
            ]);
        }


        return to_route('project-manager.tasks.index')
            ->with('success', "Task \"{$task->name}\" was updated");
    }

    public function destroy(Request $request, Task $task)
    {
        $this->ensureTaskBelongsToManager($task, $request->user()->id);

        $name = $task->name;
        $task->delete();

        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }

        return to_route('project-manager.tasks.index')
            ->with('success', "Task \"{$name}\" was deleted");
    }

    private function ensureTaskBelongsToManager(Task $task, int $managerId): void
    {
        $task->loadMissing('project');

        if (! $task->project || $task->project->project_manager_id !== $managerId) {
            abort(404);
        }
    }

    private function assertProjectBelongsToManager(int $projectId, int $managerId): void
    {
        $ownsProject = Project::where('id', $projectId)
            ->where('project_manager_id', $managerId)
            ->exists();

        if (! $ownsProject) {
            abort(404);
        }
    }
}
