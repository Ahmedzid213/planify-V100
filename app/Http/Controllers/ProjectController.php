<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource; // Make sure UserResource is imported
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Notification;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::with(['manager', 'createdBy', 'updatedBy']);

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }
        if (request("manager_id")) {
            $query->where("project_manager_id", request("manager_id"));
        }

        $projects = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        $managers = User::select('id', 'name')->orderBy('name')->get();

        return inertia("Project/Index", [
            "projects" => ProjectResource::collection($projects),
            'managers' => $managers,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            // You can optionally add a pageTitle here for clarity
            'pageTitle' => "All Projects"
        ]);
    }

    // ... (create, store, show, edit, update, destroy methods remain the same)
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $managers = User::select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return inertia('Project/Create', [
            'managers' => $managers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        if ($image) {
            $data['image_path'] = $image->store('project/' . Str::random(), 'public');
        }

        $project = Project::create($data);

        // Create a notification
        Notification::create([
            'user_id' => Auth::id(),
            'type' => 'new_project',
            'data' => [
                'project_id' => $project->id,
                'project_name' => $project->name,
            ]
        ]);

        return to_route('project.index')
            ->with('success', 'Project was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $project->load(['manager', 'createdBy', 'updatedBy']);

        $query = $project->tasks();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Project/Show', [
            'project' => new ProjectResource($project),
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $managers = User::select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();
        $project->load(['manager']);

        return inertia('Project/Edit', [
            'project' => new ProjectResource($project),
            'managers' => $managers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();

        if ($image) {
            if ($project->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($project->image_path));
            }
            $data['image_path'] = $image->store('project/' . Str::random(), 'public');
        }

        $project->update($data);

        return to_route('project.index')
            ->with('success', "Project \"$project->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $name = $project->name;
        $project->delete();

        if ($project->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($project->image_path));
        }

        return to_route('project.index')
            ->with('success', "Project \"$name\" was deleted");
    }


    // 👇 **** THIS IS THE CORRECTED METHOD **** 👇
    public function myProjects()
    {
        $user = Auth::user();

        // ✅ 1. Eager-load the relationships just like in the index method
        $query = Project::with(['manager', 'createdBy', 'updatedBy'])
                        ->where('project_manager_id', $user->id);

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }
        // This filter is not strictly necessary here, but it's good to keep for consistency
        if (request("manager_id")) {
            $query->where("project_manager_id", request("manager_id"));
        }

        $projects = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        // ✅ 2. Get the list of managers for the filter dropdown
        $managers = User::select('id', 'name')->orderBy('name')->get();

        return inertia("Project/Index", [
            "projects" => ProjectResource::collection($projects),
            'managers' => $managers, // ✅ 3. Pass the managers to the view
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'pageTitle' => "My Projects",
        ]);
    }
}