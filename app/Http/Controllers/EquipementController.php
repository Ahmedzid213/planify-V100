<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEquipementRequest;
use App\Http\Requests\UpdateEquipementRequest;
use App\Http\Resources\EquipementResource;
use App\Models\Equipement;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class EquipementController extends Controller
{
    private const STATUS_OPTIONS = [
        'in_service' => 'In service',
        'maintenance_due' => 'Maintenance due',
        'out_of_service' => 'Out of service',
        'retired' => 'Retired',
    ];

    private const MAINTENANCE_TYPES = [
        'maintenance' => 'Maintenance',
        'calibration' => 'Calibration',
    ];

    public function index()
    {
        $query = Equipement::query();
        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        if ($name = request('name')) {
            $query->where('name', 'like', "%{$name}%");
        }

        if ($brand = request('brand')) {
            $query->where('brand', 'like', "%{$brand}%");
        }

        if ($status = request('status')) {
            $query->where('status', $status);
        }

        if (request('attention') === 'overdue') {
            $query->where(function ($builder) {
                $builder
                    ->whereNotNull('next_maintenance_due_at')
                    ->whereDate('next_maintenance_due_at', '<', now()->toDateString())
                    ->orWhere(function ($inner) {
                        $inner
                            ->whereNotNull('next_calibration_due_at')
                            ->whereDate('next_calibration_due_at', '<', now()->toDateString());
                    });
            });
        }

        $equipements = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Equipement/Index', [
            'equipements' => EquipementResource::collection($equipements),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function create()
    {
        return inertia('Equipement/Create', [
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function store(StoreEquipementRequest $request)
    {
        Equipement::create($this->sanitizeData($request->validated()));

        return to_route('equipement.index')->with('success', 'Equipement was created');
    }

    public function show(Equipement $equipement)
    {
        $equipement->load(['maintenances' => function ($query) {
            $query->orderBy('scheduled_at');
        }]);

        $qrCodeBase64 = base64_encode(
            QrCode::format('png')
                ->size(220)
                ->errorCorrection('H')
                ->generate(route('equipement.show', $equipement))
        );

        $equipement->setAttribute('qr_code_base64', $qrCodeBase64);

        return inertia('Equipement/Show', [
            'equipement' => new EquipementResource($equipement),
            'statusOptions' => $this->statusOptions(),
            'maintenanceTypes' => $this->maintenanceTypes(),
            'success' => session('success'),
        ]);
    }

    public function edit(Equipement $equipement)
    {
        return inertia('Equipement/Edit', [
            'equipement' => new EquipementResource($equipement),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function update(UpdateEquipementRequest $request, Equipement $equipement)
    {
        $equipement->update($this->sanitizeData($request->validated()));

        return to_route('equipement.index')->with('success', "Equipement \"{$equipement->name}\" was updated");
    }

    public function destroy(Equipement $equipement)
    {
        $name = $equipement->name;
        $equipement->delete();

        return to_route('equipement.index')->with('success', "Equipement \"{$name}\" was deleted");
    }

    private function sanitizeData(array $data): array
    {
        foreach (['commissioned_at', 'next_maintenance_due_at', 'next_calibration_due_at'] as $field) {
            if (empty($data[$field])) {
                $data[$field] = null;
            }
        }

        foreach (['maintenance_interval_days', 'calibration_interval_days'] as $field) {
            $data[$field] = isset($data[$field]) && $data[$field] !== '' ? (int) $data[$field] : null;
        }

        return $data;
    }

    private function statusOptions(): array
    {
        return collect(self::STATUS_OPTIONS)
            ->map(fn ($label, $value) => ['label' => $label, 'value' => $value])
            ->values()
            ->all();
    }

    private function maintenanceTypes(): array
    {
        return collect(self::MAINTENANCE_TYPES)
            ->map(fn ($label, $value) => ['label' => $label, 'value' => $value])
            ->values()
            ->all();
    }
}