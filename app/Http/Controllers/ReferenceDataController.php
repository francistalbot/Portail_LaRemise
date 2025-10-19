<?php

namespace App\Http\Controllers;

use App\Models\Poste;
use App\Models\Succursale;
use App\Models\Comite;
use App\Models\Benevole;
use Illuminate\Http\Request;

class ReferenceDataController extends Controller
{
    /**
     * Récupérer toutes les données de référence en une seule requête
     */
    public function index()
    {
        return response()->json([
            'succursales' => Succursale::all(['id', 'nom', 'couleur']),
            'comites' => Comite::with('succursale:id,nom')->get(['id', 'nom', 'couleur', 'succursale_id']),
            'postes' => Poste::all(['id', 'nom']),
            'benevoles' => Benevole::with('comite:id,nom')->get(['id', 'nom', 'email', 'comite_id'])
        ]);
    }

    /**
     * Succursales
     */
    public function succursales()
    {
        return response()->json(Succursale::all(['id', 'nom', 'couleur']));
    }

    public function storeSuccursale(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:succursales',
            'couleur' => 'nullable|string|size:7' // Format hex #ffffff
        ]);

        $succursale = Succursale::create($validated);
        return response()->json($succursale, 201);
    }

    /**
     * Comités
     */
    public function comites()
    {
        return response()->json(
            Comite::with('succursale:id,nom')
                ->get(['id', 'nom', 'couleur', 'succursale_id'])
        );
    }

    public function storeComite(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:comites',
            'succursale_id' => 'required|exists:succursales,id',
            'couleur' => 'nullable|string|size:7'
        ]);

        $comite = Comite::create($validated);
        return response()->json($comite->load('succursale'), 201);
    }

    /**
     * Postes
     */
    public function postes()
    {
        return response()->json(Poste::all(['id', 'nom']));
    }

    public function storePoste(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:postes'
        ]);

        $poste = Poste::create($validated);
        return response()->json($poste, 201);
    }

    /**
     * Bénévoles
     */
    public function benevoles()
    {
        return response()->json(
            Benevole::with('comite:id,nom')
                ->get(['id', 'nom', 'email', 'comite_id'])
        );
    }

    public function storeBenevole(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:benevoles',
            'comite_id' => 'required|exists:comites,id',
            'slackUserId' => 'nullable|string'
        ]);

        $benevole = Benevole::create($validated);
        return response()->json($benevole->load('comite'), 201);
    }

    public function destroyBenevole(Benevole $benevole)
    {
        Benevole::destroy($benevole->id);
        return response()->json(['message' => 'Benevole supprime avec succes.']);
    }

    /**
     * Méthodes utilitaires
     */
    public function comitesBySuccursale(Succursale $succursale)
    {
        return response()->json(
            $succursale->comites()->get(['id', 'nom', 'couleur'])
        );
    }

    public function benevolesByComite(Comite $comite)
    {
        return response()->json(
            $comite->benevoles()->get(['id', 'nom', 'email'])
        );
    }
    
}
