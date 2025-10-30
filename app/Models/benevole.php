<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class benevole extends Model
{

    protected $fillable = [
        'nom',
        'email',
        'slackUserId',
        'email',
        'comite_id',
    ];

    public function comite()
    {
        return $this->belongsTo(Comite::class);
    }
}
