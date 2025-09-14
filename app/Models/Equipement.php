<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'brand',
        'reference',
        'serial_number',
        'note',
        'user_id', // This is important for assignments
    ];

    /**
     * Get the user that the equipment is assigned to.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}