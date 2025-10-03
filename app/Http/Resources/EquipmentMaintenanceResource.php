<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentMaintenanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at?->format('Y-m-d'),
            'completed_at' => $this->completed_at?->format('Y-m-d'),
            'performed_by' => $this->performed_by,
            'notes' => $this->notes,
            'is_overdue' => (bool) ($this->status === 'scheduled' && $this->scheduled_at?->isPast()),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}