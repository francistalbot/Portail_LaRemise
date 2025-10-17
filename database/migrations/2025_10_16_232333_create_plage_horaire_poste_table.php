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
        Schema::create('plage_horaire_poste', function (Blueprint $table) {
            $table->id();
            
            // Clés étrangères
            $table->foreignId('plage_horaire_id')->constrained('plage_horaires')->onDelete('cascade');
            $table->foreignId('poste_id')->constrained('postes')->onDelete('cascade');
            

            $table->timestamps();
            
            // Index unique pour éviter les doublons
            $table->unique(['plage_horaire_id', 'poste_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plage_horaire_poste');
    }
};
