<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompleteEquipmentMaintenanceRequest;
use App\Http\Requests\StoreEquipmentMaintenanceRequest;
use App\Models\Equipement;
use App\Models\EquipmentMaintenance;
use Illuminate\Http\RedirectResponse;

class EquipmentMaintenanceController extends Controller
{
    public function store(StoreEquipmentMaintenanceRequest $request, Equipement $equipement): RedirectResponse
    {
        $equipement->maintenances()->create($request->validated() + ['status' => 'scheduled']);

        $this->refreshEquipmentDueDates($equipement);

        return back()->with('success', 'Maintenance entry scheduled.');
    }

    public function complete(CompleteEquipmentMaintenanceRequest $request, Equipement $equipement, EquipmentMaintenance $maintenance): RedirectResponse
    {
        $this->ensureBelongsToEquipement($equipement, $maintenance);

        $data = $request->validated();
        $maintenance->fill($data);
        $maintenance->completed_at = $data['completed_at'] ?? now();
        $maintenance->status = 'completed';
        $maintenance->save();

        $this->applyCompletionSideEffects($equipement, $maintenance);

        return back()->with('success', 'Maintenance entry marked as completed.');
    }

    public function destroy(Equipement $equipement, EquipmentMaintenance $maintenance): RedirectResponse
    {
        $this->ensureBelongsToEquipement($equipement, $maintenance);

        $maintenance->delete();

        $this->refreshEquipmentDueDates($equipement);

        return back()->with('success', 'Maintenance entry removed.');
    }

    private function ensureBelongsToEquipement(Equipement $equipement, EquipmentMaintenance $maintenance): void
    {
        abort_if($maintenance->equipement_id !== $equipement->id, 404);
    }

    private function applyCompletionSideEffects(Equipement $equipement, EquipmentMaintenance $maintenance): void
    {
        $updates = [];

        if ($maintenance->type === 'maintenance') {
            $updates['last_maintenance_completed_at'] = $maintenance->completed_at;
            $this->ensureRecurringSchedule($equipement, $maintenance, 'maintenance', $equipement->maintenance_interval_days);
        } elseif ($maintenance->type === 'calibration') {
            $updates['last_calibration_completed_at'] = $maintenance->completed_at;
            $this->ensureRecurringSchedule($equipement, $maintenance, 'calibration', $equipement->calibration_interval_days);
        }

        if (! empty($updates)) {
            $equipement->forceFill($updates)->save();
        }

        $this->refreshEquipmentDueDates($equipement);
    }

    private function ensureRecurringSchedule(
        Equipement $equipement,
        EquipmentMaintenance $maintenance,
        string $type,
        ?int $intervalDays
    ): void {
        if (! $intervalDays || ! $maintenance->completed_at) {
            return;
        }

        $hasUpcoming = $equipement->maintenances()
            ->where('type', $type)
            ->whereNull('completed_at')
            ->exists();

        if ($hasUpcoming) {
            return;
        }

        $nextDate = $maintenance->completed_at->copy()->addDays($intervalDays);

        $equipement->maintenances()->create([
            'type' => $type,
            'status' => 'scheduled',
            'scheduled_at' => $nextDate,
            'notes' => 'Auto-scheduled from recurring interval',
        ]);
    }

    private function refreshEquipmentDueDates(Equipement $equipement): void
    {
        $nextMaintenance = $equipement->maintenances()
            ->where('type', 'maintenance')
            ->whereNull('completed_at')
            ->orderBy('scheduled_at')
            ->value('scheduled_at');

        $nextCalibration = $equipement->maintenances()
            ->where('type', 'calibration')
            ->whereNull('completed_at')
            ->orderBy('scheduled_at')
            ->value('scheduled_at');

        $equipement->forceFill([
            'next_maintenance_due_at' => $nextMaintenance,
            'next_calibration_due_at' => $nextCalibration,
        ])->save();
    }
}