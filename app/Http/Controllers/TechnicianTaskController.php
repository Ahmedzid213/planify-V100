<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TechnicianTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Task::with(['project.manager', 'assignedUser', 'createdBy', 'updatedBy'])
            ->where('assigned_user_id', $user->id);

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
            ->orderBy($request->input('sort_field', 'created_at'), $request->input('sort_direction', 'desc'))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('TechnicianTasks/Index', [
            'tasks' => TaskResource::collection($tasks),
            'filters' => $request->only(['name', 'status', 'priority', 'sort_field', 'sort_direction']),
        ]);
    }

    public function show(Request $request, Task $task): Response
    {
        abort_if($task->assigned_user_id !== Auth::id(), 404);

        $task->load(['project.manager', 'assignedUser', 'createdBy', 'updatedBy']);

        return Inertia::render('TechnicianTasks/Show', [
            'task' => new TaskResource($task),
        ]);
    }
}
