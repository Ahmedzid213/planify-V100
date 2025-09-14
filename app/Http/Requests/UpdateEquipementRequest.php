<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        $equipement = $this->route("equipement");
        return [
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'reference' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255', Rule::unique('equipements')->ignore($equipement->id)],
            'note' => ['nullable', 'string'],
        ];
    }
}