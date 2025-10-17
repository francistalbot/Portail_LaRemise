<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Affectation extends Model
{
    
    protected $fillable = [
        'plage_horaire_id',
        'poste_id',
        'benevole_id',
        'date_occurrence',
        'heure_debut',
        'date_fin',
    ];

}
