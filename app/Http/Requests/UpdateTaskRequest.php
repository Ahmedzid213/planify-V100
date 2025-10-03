<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->user();

        $projectRule = Rule::exists('projects', 'id');

        if ($user && $user->role === 'project manager') {
            $projectRule = $projectRule->where(fn ($query) => $query->where('project_manager_id', $user->id));
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'max:5120'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'project_id' => ['required', $projectRule],
            'assigned_user_id' => [
                'required',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role', 'technicien')),
            ],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
        ];
    }
}
