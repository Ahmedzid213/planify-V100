<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_path',
        'name',
        'description',
        'status',
        'due_date',
        'start_date',
        'client_name',
        'client_address',
        'client_phone',
        'client_email',
        'created_by',
        'updated_by',
        'project_manager_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function manager()
<<<<<<< HEAD
    {
        return $this->belongsTo(User::class, 'project_manager_id');
=======
{
return $this->belongsTo(User::class, 'project_manager_id');
}
public function files()
    {
        return $this->morphMany(File::class, 'fileable');
>>>>>>> de514085834f03fb9afa34d9fc265c4e77b2b377
    }
}
