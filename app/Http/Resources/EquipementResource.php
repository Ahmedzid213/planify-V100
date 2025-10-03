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
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'status' => $this->status,
            'commissioned_at' => $this->commissioned_at?->format('Y-m-d'),
            'next_maintenance_due_at' => $this->next_maintenance_due_at?->format('Y-m-d'),
            'next_calibration_due_at' => $this->next_calibration_due_at?->format('Y-m-d'),
            'maintenance_interval_days' => $this->maintenance_interval_days,
            'calibration_interval_days' => $this->calibration_interval_days,
            'last_maintenance_completed_at' => $this->last_maintenance_completed_at?->format('Y-m-d'),
            'last_calibration_completed_at' => $this->last_calibration_completed_at?->format('Y-m-d'),
            'maintenance_overdue' => (bool) ($this->next_maintenance_due_at && $this->next_maintenance_due_at->isPast()),
            'calibration_overdue' => (bool) ($this->next_calibration_due_at && $this->next_calibration_due_at->isPast()),
            'qr_code_base64' => $this->when(isset($this->qr_code_base64), $this->qr_code_base64),
            'maintenances' => EquipmentMaintenanceResource::collection(
                $this->whenLoaded('maintenances')
            ),
        ];
    }
}