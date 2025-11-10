<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Succursale extends Model
{

    protected $fillable = [
        'nom',
    ];

    /**
     * Relation: Une succursale a plusieurs comités
     */
    public function comites(): HasMany
    {
        return $this->hasMany(Comite::class);
    }
}
