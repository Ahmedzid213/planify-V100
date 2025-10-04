<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChecklistItemResource;
use App\Models\ChecklistItem;
use App\Models\Notification;
use App\Models\Task;
use Illuminate\Http\Request;

class ChecklistItemController extends Controller
{
    public function store(Request $request, Task $task): ChecklistItemResource
    {
        $access = $this->resolveAccessState($request, $task);
        abort_if(! $access['isProjectManager'], 403);

        $validated = $request->validate([
            'label' => ['required', 'string', 'max:255'],
        ]);

        $item = $task->checklists()->create([
            'label' => $validated['label'],
        ]);

        return new ChecklistItemResource($item->fresh());
    }

    public function update(Request $request, Task $task, ChecklistItem $checklistItem): ChecklistItemResource
    {
        $access = $this->resolveAccessState($request, $task);
        abort_if($checklistItem->task_id !== $task->id, 404);

        $validated = $request->validate([
            'label' => ['sometimes', 'string', 'max:255'],
            'is_checked' => ['sometimes', 'boolean'],
        ]);

        if ($validated === []) {
            return new ChecklistItemResource($checklistItem);
        }

        if (array_key_exists('label', $validated) && ! $access['isProjectManager']) {
            abort(403);
        }

        if (array_key_exists('is_checked', $validated) && ! $access['canToggle']) {
            abort(403);
        }

        $checklistItem->fill($validated);
        $checklistItem->save();

        if (
            array_key_exists('is_checked', $validated)
            && $validated['is_checked']
            && $access['isAssignedUser']
            && $access['user']->role === 'technicien'
            && $task->project
            && $task->project->project_manager_id
            && ! $task->checklists()->where('is_checked', false)->exists()
        ) {
            Notification::create([
                'user_id' => $task->project->project_manager_id,
                'type' => 'checklist_completed',
                'data' => [
                    'task_id' => $task->id,
                    'task_name' => $task->name,
                    'completed_by' => $access['user']->name,
                ],
            ]);
        }

        return new ChecklistItemResource($checklistItem->fresh());
    }

    public function destroy(Request $request, Task $task, ChecklistItem $checklistItem)
    {
        $access = $this->resolveAccessState($request, $task);
        abort_if($checklistItem->task_id !== $task->id, 404);
        abort_if(! $access['isProjectManager'], 403);

        $checklistItem->delete();

        return response()->noContent();
    }

    private function resolveAccessState(Request $request, Task $task): array
    {
        $user = $request->user();
        abort_if(! $user, 403);

        $task->loadMissing('project');

        $isProjectManager = $task->project && (int) $task->project->project_manager_id === (int) $user->id;
        $isAssignedUser = (int) $task->assigned_user_id === (int) $user->id;
        $hasElevatedRole = in_array($user->role, ['technical manager', 'admin'], true);

        return [
            'user' => $user,
            'isProjectManager' => $isProjectManager,
            'isAssignedUser' => $isAssignedUser,
            'hasElevatedRole' => $hasElevatedRole,
            'canToggle' => $isProjectManager || $isAssignedUser || $hasElevatedRole,
        ];
    }
}