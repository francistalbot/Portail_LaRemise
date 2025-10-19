<?php

namespace App\Http\Controllers;

use App\Models\PlageHoraire;
use Illuminate\Http\Request;

class PlageHoraireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plagesHoraires = PlageHoraire::all();
        return response()->json($plagesHoraires);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'description' => 'nullable|string',
            'is_all_day' => 'boolean',
            'recurrence_regle' => 'nullable|string',
            'recurrence_exception' => 'nullable|string',
            'recurrence_id' => 'nullable|integer|exists:plage_horaires,id',
            'comite_id' => 'required|integer|exists:comites,id'
        ]);
        $plageHoraire = PlageHoraire::create($validated);
        return response()->json($plageHoraire, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PlageHoraire $plageHoraire)
    {
        return response()->json($plageHoraire);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PlageHoraire $plageHoraire)
    {
        //
    
        $validated = request()->validate([
            'titre' => 'sometimes|required|string|max:255',
            'date_debut' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date|after:date_debut',
            'description' => 'nullable|string',
            'is_all_day' => 'sometimes|boolean',
            'recurrence_regle' => 'nullable|string',
            'recurrence_exception' => 'nullable|string',
            'recurrence_id' => 'nullable|integer|exists:plage_horaires,id',
            'comite_id' => 'sometimes|required|integer|exists:comites,id'
        ]);
        PlageHoraire::where('id', $plageHoraire->id)->update($validated);
        return response()->json(['message' => 'Plage horaire mise a jour avec succes.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlageHoraire $plageHoraire)
    {
        $plageHoraire = PlageHoraire::destroy($plageHoraire->id);
        return response()->json(['message' => 'Plage horaire supprimee avec succes.']);
    }
}
