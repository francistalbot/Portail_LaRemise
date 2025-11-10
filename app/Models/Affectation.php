<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Affectation extends Model
{
    
    protected $fillable = [
        'plage_horaire_id',
        'poste_id',
        'benevole_id',
        'date_occurrence',
    ];

    /**
     * Relation avec le bénévole
     */
    public function benevole(): BelongsTo
    {
        return $this->belongsTo(Benevole::class);
    }

    /**
     * Relation avec le poste
     */
    public function poste(): BelongsTo
    {
        return $this->belongsTo(Poste::class);
    }

    /**
     * Relation avec la plage horaire
     */
    public function plageHoraire(): BelongsTo
    {
        return $this->belongsTo(PlageHoraire::class);
    }
}
