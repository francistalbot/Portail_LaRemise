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
        Schema::create('plage_horaires', function (Blueprint $table) {
            $table->id();
            
            // Informations temporelles
            $table->dateTime('date_debut'); // Date et heure de début
            $table->dateTime('date_fin');   // Date et heure de fin
            $table->boolean('is_all_day')->default(false); // Indique si c'est une journée complète

            // Informations descriptives
            $table->string('titre');
            $table->text('description')->nullable();

            $table->string('recurrence_regle')->nullable(); // Règles de récurrence en format JSON
            $table->string('recurrence_exception')->nullable(); // Exceptions de récurrence en format JSON
            $table->foreignId('recurrence_id')->nullable()->constrained('plage_horaires')->onDelete('cascade'); // Référence vers la plage mère pour les récurrences
            // Relations
            $table->foreignId('comite_id')->nullable()->constrained('comites')->onDelete('set null');
            
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plage_horaires');
    }
};
