<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'reference' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255', 'unique:equipements,serial_number'],
            'note' => ['nullable', 'string'],
        ];
    }
}