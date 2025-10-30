<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Succursale extends Model
{

    protected $fillable = [
        'nom',
    ];

    /**
     * Relation: Une succursale a plusieurs comités
     */
    public function comites()
    {
        return $this->hasMany(Comite::class);
    }
}
