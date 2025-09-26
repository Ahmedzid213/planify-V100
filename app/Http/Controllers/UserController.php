<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use Illuminate\Support\Facades\Hash;
use App\Models\Equipement; 
use App\Models\Project;    
use App\Models\Task;      

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        $users = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("User/Index", [
            "users" => UserCrudResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("User/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        
        // This is the key change for creating users
        User::create($data);

        return to_route('user.index')
            ->with('success', 'User was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return inertia('User/Show', [
            'user' => new UserCrudResource($user),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('User/Edit', [
            'user' => new UserCrudResource($user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $password = $data['password'] ?? null;
        if ($password) {
            $data['password'] = Hash::make($password);
        } else {
            unset($data['password']);
        }
        
        // This is the key change for updating users
        $user->update($data);

        return to_route('user.index')
            ->with('success', "User \"$user->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
     public function destroy(User $user)
    {
        $name = $user->name;

        // 1. Un-assign the user from projects
        Project::where('project_manager_id', $user->id)->update(['project_manager_id' => null]);
        Project::where('created_by', $user->id)->update(['created_by' => null]);
        Project::where('updated_by', $user->id)->update(['updated_by' => null]);

        // 2. Un-assign the user from tasks
        Task::where('assigned_user_id', $user->id)->update(['assigned_user_id' => null]);
        Task::where('created_by', $user->id)->update(['created_by' => null]);
        Task::where('updated_by', $user->id)->update(['updated_by' => null]);

        // 3. Delete related equipment assignments
        Equipement::where('user_id', $user->id)->delete();

        // 4. Now, it's safe to delete the user
        $user->delete();

        return to_route('user.index')->with('success', "User \"$name\" was successfully deleted");
    }
}