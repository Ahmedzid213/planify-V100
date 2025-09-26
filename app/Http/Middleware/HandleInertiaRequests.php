<?php
namespace App\Http\Middleware;

use App\Models\Project; // 👈 1. Import the Project model
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // 👇 2. Add logic to determine if the user is a project manager
        $user = $request->user();
        $isProjectManager = false;

        if ($user) {
            $isProjectManager = Project::where('project_manager_id', $user->id)->exists();
        }

        return [
            ...parent::share($request),
            'auth' => [
                // 👇 3. Share the user data along with the new is_project_manager flag
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_project_manager' => $isProjectManager,
                ] : null,
            ],
        ];
    }
}