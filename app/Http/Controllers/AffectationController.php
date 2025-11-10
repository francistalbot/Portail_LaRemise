<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    public function index()
    {
        $affectations = Affectation::with(['benevole', 'poste', 'plageHoraire'])->get();
        return response()->json($affectations);
    }
    public function show(Affectation $affectation)
    {
        return response()->json(
            $affectation
        );
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'plage_horaire_id' => 'required|exists:plage_horaires,id',
            'poste_id' => 'required|exists:postes,id',
            'benevole_id' => 'required|exists:benevoles,id',
            'date_occurence' => 'required|date|date_format:Y-m-d',
        ]);

        $affectation = Affectation::create($validated);
        return response()->json($affectation, 201);
    }

    public function update(Request $request, Affectation $affectation)
    {
        $validated = $request->validate([
            'plage_horaire_id' => 'sometimes|required|exists:plage_horaires,id',
            'poste_id' => 'sometimes|required|exists:postes,id',
            'benevole_id' => 'sometimes|required|exists:benevoles,id',
            'date_occurence' => 'sometimes|required|date|date_format:Y-m-d'
    ]);

        $affectation->update($validated);
        
        // Charger les relations si nécessaire pour la réponse
        return response()->json(
            $affectation->load(['benevole', 'poste', 'plageHoraire'])
        );
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Affectation $affectation)
    {
        $affectation->delete();
        return response()->json(null, 204);
    }
}
