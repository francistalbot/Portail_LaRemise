<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();
            
            // Relations principales
            $table->foreignId('benevole_id')->constrained('benevoles')->onDelete('cascade');
            $table->foreignId('poste_id')->constrained('postes')->onDelete('cascade');
            $table->foreignId('plage_horaire_id')->constrained('plage_horaires')->onDelete('cascade');
            
            // Date spécifique de l'occurrence (pour les plages récurrentes)
            $table->date('date_occurrence');
            
            // Heures spécifiques pour cette affectation (peut différer de la plage principale)
            $table->time('heure_debut')->nullable();
            $table->time('date_fin')->nullable();
            
            $table->timestamps();
            
            // Index uniques et de performance
            $table->unique(['poste_id', 'plage_horaire_id', 'date_occurrence'], 'unique_affectation');
            $table->index(['plage_horaire_id', 'date_occurrence']);
            $table->index(['benevole_id', 'date_occurrence']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};
