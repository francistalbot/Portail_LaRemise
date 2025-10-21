<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comite extends Model
{

    protected $fillable = [
        'nom',
        'couleur',
        'succursale_id',
    ];

    /**
     * Relation: Un comité appartient à une succursale
     */
    public function succursale()
    {
        return $this->belongsTo(Succursale::class);
    }

    /**
     * Relation: Un comité a plusieurs bénévoles
     */
    public function benevoles()
    {
        return $this->hasMany(Benevole::class);
    }
}
