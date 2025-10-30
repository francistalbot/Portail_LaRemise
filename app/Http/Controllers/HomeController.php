<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use App\Models\Benevole;
use App\Models\Comite;
use App\Models\PlageHoraire;
use App\Models\Poste;
use App\Models\Succursale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function calendar(): Response
    {
        // Récupérer toutes les données nécessaires
        $succursales = Succursale::all();
        $comites = Comite::all();
        $postes = Poste::all();
        $benevoles = Benevole::all();
        $plagesHoraires = PlageHoraire::with(['succursale', 'comite'])->get();
        $affectations = Affectation::with(['benevole', 'poste', 'plageHoraire.succursale', 'plageHoraire.comite'])->get();
        
        // Organiser les données de référence pour les dropdowns/filtres
        $referenceData = [
            'succursales' => $succursales->map(function ($succursale) {
                return [
                    'Id' => $succursale->id,
                    'Name' => $succursale->nom,
                    'Text' => $succursale->nom,
                    'Color' => $succursale->couleur ?? '#3788d8'
                ];
            }),
            'comites' => $comites->map(function ($comite) {
                return [
                    'Id' => $comite->id,
                    'Name' => $comite->nom,
                    'Text' => $comite->nom,
                    'DepartmentId' => $comite->succursale_id,
                    'Color' => $comite->couleur ?? '#56ca85'
                ];
            }),
            'postes' => $postes->map(function ($poste) {
                return [
                    'Id' => $poste->id,
                    'Name' => $poste->nom,
                    'Text' => $poste->nom,
                    'Description' => $poste->description
                ];
            }),
            'benevoles' => $benevoles->map(function ($benevole) {
                return [
                    'Id' => $benevole->id,
                    'Name' => $benevole->nom,
                    'Email' => $benevole->email,
                    'Phone' => $benevole->telephone ?? '',
                    'Available' => true // À adapter selon votre logique
                ];
            })
        ];

        return Inertia::render('Calendar', [
            'data' => [
                'affectations' => $affectations,
                'succursales' => $referenceData['succursales'],
                'comites' => $referenceData['comites'],
                'postes' => $referenceData['postes'],
                'benevoles' => $referenceData['benevoles'],
                'plagesHoraires' => $plagesHoraires
            ]
        ]);
    }

    /**
     * Transformer les affectations en événements pour le calendrier
     */
    private function transformAffectationsToEvents($affectations): array
    {
        return $affectations->map(function ($affectation) {
            $plageHoraire = $affectation->plageHoraire;
            
            return [
                'Id' => $affectation->id,
                'Subject' => $affectation->poste->nom,
                'Name' => $affectation->benevole->nom,
                'StartTime' => $plageHoraire->date_debut->format('Y-m-d') . 'T' . $plageHoraire->heure_debut,
                'EndTime' => $plageHoraire->date_fin->format('Y-m-d') . 'T' . $plageHoraire->heure_fin,
                'IsAllDay' => false,
                'Description' => $affectation->poste->description ?? '',
                'Location' => $plageHoraire->succursale->nom ?? '',
                'DepartmentId' => $plageHoraire->succursale_id,
                'ComiteId' => $plageHoraire->comite_id,
                'PosteId' => $affectation->poste_id,
                'BenevoleId' => $affectation->benevole_id,
                'PlageHoraireId' => $affectation->plage_horaire_id,
            ];
        })->toArray();
    }
    
}
