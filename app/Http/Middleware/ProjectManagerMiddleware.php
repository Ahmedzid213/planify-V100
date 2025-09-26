<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ProjectManagerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $isProjectManager = Project::where('project_manager_id', Auth::id())->exists();

            if ($isProjectManager) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized action.');
    }
}