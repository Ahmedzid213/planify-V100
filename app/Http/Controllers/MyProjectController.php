<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MyProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Project::with(['manager', 'createdBy', 'updatedBy'])
            ->where('project_manager_id', $user->id);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $projects = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('MyProjects/Index', [
            'projects' => ProjectResource::collection($projects),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Project $project): Response
    {
        if ($project->project_manager_id !== Auth::id()) {
            abort(404);
        }

        $project->load(['manager', 'createdBy', 'updatedBy']);

        $tasks = $project->tasks()
            ->with(['assignedUser', 'createdBy', 'updatedBy', 'project'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('MyProjects/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
        ]);
    }
}
