<?php

namespace App\Http\Controllers;

use App\Models\Equipement;
use App\Models\User;
use Illuminate\Http\Request;

class EquipementAssignmentController extends Controller
{
    private const STATUS_LABELS = [
        'in_service' => 'In service',
        'maintenance_due' => 'Maintenance due',
        'out_of_service' => 'Out of service',
        'retired' => 'Retired',
    ];

    private const ASSIGNABLE_STATUSES = [
        'in_service',
    ];

    public function index()
    {
        $equipements = Equipement::with('user:id,name')
            ->select(['id', 'name', 'status', 'user_id'])
            ->orderBy('name')
            ->get();

        $freeEquipements = $equipements
            ->whereNull('user_id')
            ->values()
            ->map(function (Equipement $equipement) {
                return $this->formatEquipement($equipement, true);
            });

        $inUseEquipements = $equipements
            ->whereNotNull('user_id')
            ->values()
            ->map(function (Equipement $equipement) {
                return $this->formatEquipement($equipement);
            });

        return inertia('EquipementAssignment/Index', [
            'freeEquipements' => $freeEquipements,
            'inUseEquipements' => $inUseEquipements,
            'users' => User::select('id', 'name')->orderBy('name')->get(),
            'statusLabels' => self::STATUS_LABELS,
            'success' => session('success'),
        ]);
    }

    public function assign(Request $request)
    {
        $validated = $request->validate([
            'equipement_id' => ['required', 'exists:equipements,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $equipement = Equipement::findOrFail($validated['equipement_id']);

        if ($equipement->user_id) {
            return back()
                ->withErrors(['equipement_id' => 'This equipment is already assigned to a user.'])
                ->withInput();
        }

        if (! in_array($equipement->status, self::ASSIGNABLE_STATUSES, true)) {
            return back()
                ->withErrors(['equipement_id' => 'This equipment is not available for assignment.'])
                ->withInput();
        }

        $equipement->forceFill([
            'user_id' => $validated['user_id'],
        ])->save();

        return back()->with('success', 'Equipement assigned successfully.');
    }

    public function unassign(Equipement $equipement)
    {
        $equipement->forceFill([
            'user_id' => null,
        ])->save();

        return back()->with('success', 'Equipement unassigned successfully.');
    }

    private function formatEquipement(Equipement $equipement, bool $withAssignableFlag = false): array
    {
        $data = [
            'id' => $equipement->id,
            'name' => $equipement->name,
            'status' => $equipement->status,
            'status_label' => self::STATUS_LABELS[$equipement->status] ?? $this->humanizeStatus($equipement->status),
            'user_id' => $equipement->user_id,
            'user' => $equipement->user
                ? [
                    'id' => $equipement->user->id,
                    'name' => $equipement->user->name,
                ]
                : null,
        ];

        if ($withAssignableFlag) {
            $data['assignable'] = in_array($equipement->status, self::ASSIGNABLE_STATUSES, true);
        }

        return $data;
    }

    private function humanizeStatus(?string $status): string
    {
        if (! $status) {
            return 'Unknown';
        }

        return ucwords(str_replace('_', ' ', $status));
    }
}