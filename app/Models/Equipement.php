<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     */
    protected $fillable = [
        'name',
        'brand',
        'reference',
        'serial_number',
        'note',
        'user_id',
        'commissioned_at',
        'status',
        'next_maintenance_due_at',
        'next_calibration_due_at',
        'maintenance_interval_days',
        'calibration_interval_days',
        'last_maintenance_completed_at',
        'last_calibration_completed_at',
    ];

    /**
     * Attribute casting.
     */
    protected $casts = [
        'commissioned_at' => 'date',
        'next_maintenance_due_at' => 'date',
        'next_calibration_due_at' => 'date',
        'last_maintenance_completed_at' => 'date',
        'last_calibration_completed_at' => 'date',
        'maintenance_interval_days' => 'integer',
        'calibration_interval_days' => 'integer',
    ];

    /**
     * Get the user that the equipment is assigned to.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Maintenance records associated with the equipment.
     */
    public function maintenances()
    {
        return $this->hasMany(EquipmentMaintenance::class);
    }
}