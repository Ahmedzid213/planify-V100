<?php
namespace App\Http\Controllers;

use App\Models\Equipement;
use App\Models\User;
use Illuminate\Http\Request;

class EquipementAssignmentController extends Controller
{
    // app/Http/Controllers/EquipementAssignmentController.php
public function index()
{
    // Use get() to ensure we always receive a collection
    $allEquipements = Equipement::with('user')->get();
    $users = User::all();

    // The filter method always returns a new collection (which is array-like)
    $freeEquipements = $allEquipements->whereNull('user_id');
    $inUseEquipements = $allEquipements->whereNotNull('user_id');

    return inertia('EquipementAssignment/Index', [
        'freeEquipements' => $freeEquipements,
        'inUseEquipements' => $inUseEquipements,
        'users' => $users,
        'success' => session('success'),
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
    public function unassign(Equipement $equipement)
    {
        $equipement->user_id = null;
        $equipement->status = 'available';
        $equipement->save();

        return back()->with('success', 'Equipement unassigned successfully.');
    }
}