<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreEquipementRequest;
use App\Http\Requests\UpdateEquipementRequest;
use App\Http\Resources\EquipementResource;
use App\Models\Equipement;
use Illuminate\Http\Request;

class EquipementController extends Controller
{
    public function index()
    {
        $query = Equipement::query();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("brand")) {
            $query->where("brand", "like", "%" . request("brand") . "%");
        }
        $equipements = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
        return inertia("Equipement/Index", [
            "equipements" => EquipementResource::collection($equipements),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
    public function create()
    {
        return inertia("Equipement/Create");
    }
    public function store(StoreEquipementRequest $request)
    {
        Equipement::create($request->validated());
        return to_route('equipement.index')->with('success', 'Equipement was created');
    }
    public function show(Equipement $equipement)
    {
        return inertia('Equipement/Show', ['equipement' => new EquipementResource($equipement)]);
    }
    public function edit(Equipement $equipement)
    {
        return inertia('Equipement/Edit', ['equipement' => new EquipementResource($equipement)]);
    }
    public function update(UpdateEquipementRequest $request, Equipement $equipement)
    {
        $equipement->update($request->validated());
        return to_route('equipement.index')->with('success', "Equipement \"$equipement->name\" was updated");
    }
    public function destroy(Equipement $equipement)
    {
        $name = $equipement->name;
        $equipement->delete();
        return to_route('equipement.index')->with('success', "Equipement \"$name\" was deleted");
    }
}