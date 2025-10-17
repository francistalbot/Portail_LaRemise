<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class PlageHoraire extends Model
{

    protected $fillable = [
        'titre',
        'date_debut',
        'date_fin',
        'description',
        'is_all_day',
        'recurrence_regle',
        'recurrence_exception',
        'recurrence_id',
        'comite_id'
    ];
    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'is_all_day' => 'boolean',
        'recurrence_regle' => 'array',

    ];

    // Relations

    public function comite()
    {
        return $this->belongsTo(Comite::class);
    }

    public function succursale()
    {
        return $this->belongsTo(Succursale::class);
    }
    
    public function postes()
    {
        return $this->belongsToMany(Poste::class, 'plage_horaire_poste')
            ->withTimestamps();
    }
    // Méthodes utiles
    public function getDureeAttribute(): int
    {
        return $this->date_debut->diffInMinutes($this->date_fin);
    }

    public function getDureeHeuresAttribute(): float
    {
        return round($this->duree / 60, 2);
    }

    public function getEstAujourdhui(): bool
    {
        return $this->date_debut->isToday();
    }

    public function getEstEnCours(): bool
    {
        $maintenant = now();
        return $maintenant->between($this->date_debut, $this->date_fin);
    }

    public function getEstPasse(): bool
    {
        return $this->date_fin->isPast();
    }

    // Méthodes de conversion pour les règles de récurrence
    public function getRecurrenceRegleFormatted(): ?string
    {
        if (!$this->recurrence_regle) {
            return null;
        }

        // Convertit {"FREQ":"DAILY","INTERVAL":1,"COUNT":3} 
        // en "FREQ=DAILY;INTERVAL=1;COUNT=3"
        $parts = [];
        foreach ($this->recurrence_regle as $key => $value) {
            if (is_array($value)) {
                $value = implode(',', $value);
            }
            $parts[] = $key . '=' . $value;
        }

        return implode(';', $parts);
    }

    public function setRecurrenceFromString(string $ruleString): void
    {
        // Convertit "FREQ=DAILY;INTERVAL=1;COUNT=3"
        // en {"FREQ":"DAILY","INTERVAL":1,"COUNT":3}
        $parts = explode(';', $ruleString);
        $result = [];

        foreach ($parts as $part) {
            if (strpos($part, '=') !== false) {
                [$key, $value] = explode('=', $part, 2);
                
                // Convertir les valeurs numériques
                if (in_array($key, ['INTERVAL', 'COUNT', 'BYSETPOS'])) {
                    $value = (int) $value;
                } elseif (strpos($value, ',') !== false) {
                    $value = explode(',', $value);
                }
                
                $result[$key] = $value;
            }
        }

        $this->RecurrenceRegle = $result;
    }

    // Scopes
    public function scopeAujourdhui($query)
    {
        return $query->whereDate('DateDebut', today());
    }

    public function scopeCetteSemaine($query)
    {
        return $query->whereBetween('DateDebut', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    public function scopePourBenevole($query, $benevoleId)
    {
        return $query->where('benevole_id', $benevoleId);
    }

    public function scopePourComite($query, $comiteId)
    {
        return $query->where('comite_id', $comiteId);
    }

    public function scopeEntreDates($query, Carbon $debut, Carbon $fin)
    {
        return $query->where(function ($q) use ($debut, $fin) {
            $q->whereBetween('DateDebut', [$debut, $fin])
              ->orWhereBetween('DateFin', [$debut, $fin])
              ->orWhere(function ($q2) use ($debut, $fin) {
                  $q2->where('DateDebut', '<=', $debut)
                     ->where('DateFin', '>=', $fin);
              });
        });
    }

}
