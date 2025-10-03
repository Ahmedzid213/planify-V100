<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEquipementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $statusOptions = ['in_service', 'maintenance_due', 'out_of_service', 'retired'];

        return [
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'reference' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255', 'unique:equipements,serial_number'],
            'note' => ['nullable', 'string'],
            'commissioned_at' => ['nullable', 'date'],
            'status' => ['required', Rule::in($statusOptions)],
            'next_maintenance_due_at' => ['nullable', 'date', 'after_or_equal:commissioned_at'],
            'next_calibration_due_at' => ['nullable', 'date', 'after_or_equal:commissioned_at'],
            'maintenance_interval_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
            'calibration_interval_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
        ];
    }
}