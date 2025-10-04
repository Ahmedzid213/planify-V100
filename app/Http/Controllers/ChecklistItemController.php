<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChecklistItemResource;
use App\Models\ChecklistItem;
use App\Models\Task;
use Illuminate\Http\Request;

class ChecklistItemController extends Controller
{
    public function store(Request $request, Task $task): ChecklistItemResource
    {
        $this->ensureTaskAccess($request, $task);

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
        $this->ensureTaskAccess($request, $task);
        abort_if($checklistItem->task_id !== $task->id, 404);

        $validated = $request->validate([
            'label' => ['sometimes', 'string', 'max:255'],
            'is_checked' => ['sometimes', 'boolean'],
        ]);

        if ($validated === []) {
            return new ChecklistItemResource($checklistItem);
        }

        $checklistItem->fill($validated);
        $checklistItem->save();

        return new ChecklistItemResource($checklistItem->fresh());
    }

    public function destroy(Request $request, Task $task, ChecklistItem $checklistItem)
    {
        $this->ensureTaskAccess($request, $task);
        abort_if($checklistItem->task_id !== $task->id, 404);

        $checklistItem->delete();

        return response()->noContent();
    }

    private function ensureTaskAccess(Request $request, Task $task): void
    {
        $user = $request->user();

        abort_if(! $user, 403);

        $task->loadMissing('project');

        $isProjectManager = $task->project && (int) $task->project->project_manager_id === (int) $user->id;
        $isAssignedUser = (int) $task->assigned_user_id === (int) $user->id;
        $hasElevatedRole = in_array($user->role, ['technical manager', 'admin'], true);

        abort_if(! $isProjectManager && ! $isAssignedUser && ! $hasElevatedRole, 403);
    }
}