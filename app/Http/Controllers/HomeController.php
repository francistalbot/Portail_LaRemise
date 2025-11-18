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
    public function volunteers(): Response
    {
        $benevoles = Benevole::all();
        $comites = Comite::all();
        return Inertia::render('Volunteers', [
            'benevoles' => $benevoles,
            'comites' => $comites,
        ]);
    }

    public function calendar(): Response
    {
        // Récupérer toutes les données nécessaires
        $succursales = Succursale::all();
        $comites = Comite::all();
        $postes = Poste::all();
        $benevoles = Benevole::all();
        $plagesHoraires = PlageHoraire::with(['succursale', 'comite'])->get();
        $affectations = Affectation::with(['benevole', 'poste', 'plageHoraire.succursale', 'plageHoraire.comite'])->get();

        $plagesHoraires = $plagesHoraires->map(function ($plage) {
            return [
                'Id' => $plage->id,
                'Subject' => $plage->titre,
                'StartTime' => $plage->date_debut,
                'EndTime' => $plage->date_fin,
                'IsAllDay' => $plage->is_all_day,
                'Description' => $plage->description ?? '',
                'SuccursaleID' => $plage->comite->succursale_id,
                'ComiteID' => $plage->comite_id,
                'PosteIDs' => $plage->postes->pluck('id')->toArray(),
                'RecurrenceRule' => $plage->recurrence_regle,
                'RecurrenceException' => $plage->recurrence_exception,
                'RecurrenceID' => $plage->recurrence_id,
            ];
        });

        $succursales = $succursales->map(function ($succursale) {
                return [
                    'Id' => $succursale->id,
                    'Name' => $succursale->nom,
                ];
            });

        $comites = $comites->map(function ($comite) {
            return [
                'Id' => $comite->id,
                'Name' => $comite->nom,
                'SuccursaleID' => $comite->succursale_id,
                'Color' => $comite->couleur ?? '#56ca85'
            ];
        });

        $postes = $postes->map(function ($poste) {
            return [
                'Id' => $poste->id,
                'Name' => $poste->nom,
            ];
        
        });

        $benevoles = $benevoles->map(function ($benevole) {
                return [
                    'Id' => $benevole->id,
                    'Name' => $benevole->nom,
                    'ComiteID' => $benevole->comite_id,
                ];
            });

        return Inertia::render('Calendar', [
            'data' => [
                'affectations' => $affectations,
                'succursales' => $succursales,
                'comites' => $comites,
                'postes' => $postes,
                'benevoles' => $benevoles,
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
