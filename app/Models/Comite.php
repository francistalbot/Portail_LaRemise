<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    public function succursale(): BelongsTo
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
