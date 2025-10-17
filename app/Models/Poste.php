<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poste extends Model
{
    protected $fillable = [
        'nom'
    ];

    public function plagesHoraires()
    {
        return $this->belongsToMany(PlageHoraire::class, 'plage_horaire_poste')
            ->withTimestamps();
    }
}
