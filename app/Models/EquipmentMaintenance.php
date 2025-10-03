<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentMaintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipement_id',
        'type',
        'status',
        'scheduled_at',
        'completed_at',
        'performed_by',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'date',
        'completed_at' => 'date',
    ];

    public function equipement()
    {
        return $this->belongsTo(Equipement::class);
    }

    public function scopeScheduled($query)
    {
        return $query->whereNull('completed_at')->where('status', 'scheduled');
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'scheduled' && $this->scheduled_at?->isPast();
    }
}