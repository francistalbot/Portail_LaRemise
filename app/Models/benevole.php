<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Benevole extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'slackUserId',
        'comite_id',
    ];

    public function comite(): BelongsTo
    {
        return $this->belongsTo(Comite::class);
    }

    /**
     * Relation avec les affectations
     */
    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class);
    }
}
