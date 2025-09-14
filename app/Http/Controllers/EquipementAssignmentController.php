<?php
namespace App\Http\Controllers;

use App\Models\Equipement;
use App\Models\User;
use Illuminate\Http\Request;

class EquipementAssignmentController extends Controller
{
    public function index()
    {
        $equipements = Equipement::all();
        $users = User::all();

        $freeEquipements = $equipements->whereNull('user_id');
        $inUseEquipements = $equipements->whereNotNull('user_id');

        return inertia('EquipementAssignment/Index', [
            'freeEquipements' => $freeEquipements,
            'inUseEquipements' => $inUseEquipements,
            'users' => $users,
        ]);
    }

    public function assign(Request $request)
    {
        $request->validate([
            'equipement_id' => ['required', 'exists:equipements,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $equipement = Equipement::find($request->equipement_id);
        $equipement->user_id = $request->user_id;
        $equipement->save();

        return back()->with('success', 'Equipement assigned successfully.');
    }
}