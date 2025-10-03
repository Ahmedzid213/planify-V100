<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
<<<<<<< HEAD
            'created_at' => optional($this->created_at)?->format('Y-m-d'),
            'start_date' => optional($this->start_date)?->format('Y-m-d'),
            'due_date' => optional($this->due_date)?->format('Y-m-d'),
            'status' => $this->status,
            'client_name' => $this->client_name,
            'client_address' => $this->client_address,
            'client_phone' => $this->client_phone,
            'client_email' => $this->client_email,
            'image_path' => $this->image_path && ! str_starts_with($this->image_path, 'http')
                ? Storage::url($this->image_path)
                : $this->image_path,
            'createdBy' => new UserResource($this->whenLoaded('createdBy')),
            'updatedBy' => new UserResource($this->whenLoaded('updatedBy')),
=======
            'created_at'  => (new Carbon($this->created_at))->format('Y-m-d'),
            'due_date'    => (new Carbon($this->due_date))->format('Y-m-d'),
            'status'      => $this->status,
            'image_path'  => $this->image_path && !(str_starts_with($this->image_path, 'http'))
                                ? Storage::url($this->image_path)
                                : $this->image_path,
            'files' => $this->whenLoaded('files'),
            // Relations
            'createdBy'   => new UserResource($this->whenLoaded('createdBy')),
            'updatedBy'   => new UserResource($this->whenLoaded('updatedBy')),

            // ✅ Nouveau : Project Manager
>>>>>>> de514085834f03fb9afa34d9fc265c4e77b2b377
            'project_manager_id' => $this->project_manager_id,
            'manager' => $this->whenLoaded('manager', function () {
                return [
                    'id' => $this->manager->id,
                    'name' => $this->manager->name,
                    'email' => $this->manager->email,
                ];
            }),
        ];
    }
}
