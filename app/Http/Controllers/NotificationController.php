<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'admin') {
            abort(403, 'ACTION NON AUTORISÉE.');
        }

        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }
}

