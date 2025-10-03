<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'start_date' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
            'client_name' => ['nullable', 'string', 'max:255'],
            'client_address' => ['nullable', 'string', 'max:255'],
            'client_phone' => ['nullable', 'string', 'max:50'],
            'client_email' => ['nullable', 'email', 'max:255'],
            'project_manager_id' => ['nullable', 'integer', Rule::exists('users', 'id')->where('role', 'technicien')],
        ];
    }
}
