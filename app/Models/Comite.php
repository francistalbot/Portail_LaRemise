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

    
    public function succursale()
    {
        return $this->belongsTo(Succursale::class);
    }
}
