<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:2048', // 2MB max
            'fileable_id' => 'required',
            'fileable_type' => 'required|in:project,task',
        ]);

        $fileableId = $request->input('fileable_id');
        $fileableType = $request->input('fileable_type');

        if ($fileableType === 'project') {
            $fileable = Project::findOrFail($fileableId);
        } else {
            $fileable = Task::findOrFail($fileableId);
        }

        $file = $request->file('file');
        $path = $file->store('public/files');

        $fileable->files()->create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return back()->with('success', 'File uploaded successfully.');
    }

    public function destroy(File $file)
    {
        Storage::delete($file->path);
        $file->delete();

        return back()->with('success', 'File deleted successfully.');
    }
}