<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'brand' => $this->brand,
            'reference' => $this->reference,
            'serial_number' => $this->serial_number,
            'note' => $this->note,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}