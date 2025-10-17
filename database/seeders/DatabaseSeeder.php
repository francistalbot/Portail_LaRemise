<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Succursale;
use App\Models\Comite;
use App\Models\Poste;
use App\Models\Benevole;
use App\Models\PlageHoraire;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Utilisateur de test
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Succursales (basées sur vos mocks)
        $succursales = [
            ['id' => 1, 'nom' => 'Villeray', 'couleur' => '#ffaa00'],
            ['id' => 2, 'nom' => 'Rosemont', 'couleur' => '#f8a398'],
        ];

        foreach ($succursales as $succursale) {
            Succursale::create($succursale);
        }

        // Comités (basés sur vos mocks)
        $comites = [
            ['id' => 1, 'nom' => 'Comité Bois', 'couleur' => '#f8a398', 'succursale_id' => 1],
            ['id' => 2, 'nom' => 'Comité Outil', 'couleur' => '#7499e1', 'succursale_id' => 1],
            ['id' => 3, 'nom' => 'Comité Vélo', 'couleur' => '#4caf50', 'succursale_id' => 2],
            ['id' => 4, 'nom' => 'Comité TI', 'couleur' => '#ff9800', 'succursale_id' => 2],
        ];

        foreach ($comites as $comite) {
            Comite::create($comite);
        }

        // Postes (basés sur vos mocks)
        $postes = [
            ['id' => 1, 'nom' => 'Accueil'],
            ['id' => 2, 'nom' => 'Découverte'],
        ];

        foreach ($postes as $poste) {
            Poste::create($poste);
        }

        // Bénévoles (basés sur vos mocks)
        $benevoles = [
            ['id' => 1, 'nom' => 'Francis', 'email' => 'francis@test.com', 'comite_id' => 1],
            ['id' => 2, 'nom' => 'Benois', 'email' => 'benois@test.com', 'comite_id' => 1],
            ['id' => 3, 'nom' => 'Jean', 'email' => 'jean@test.com', 'comite_id' => 2],
            ['id' => 4, 'nom' => 'Marie', 'email' => 'marie@test.com', 'comite_id' => 2],
            ['id' => 5, 'nom' => 'Lucie', 'email' => 'lucie@test.com', 'comite_id' => 3],
            ['id' => 6, 'nom' => 'Paul', 'email' => 'paul@test.com', 'comite_id' => 3],
            ['id' => 7, 'nom' => 'Pierre', 'email' => 'pierre@test.com', 'comite_id' => 4],
            ['id' => 8, 'nom' => 'Sophie', 'email' => 'sophie@test.com', 'comite_id' => 4],
            ['id' => 9, 'nom' => 'Alice', 'email' => 'alice@test.com', 'comite_id' => 1],
            ['id' => 10, 'nom' => 'Bob', 'email' => 'bob@test.com', 'comite_id' => 2],
            ['id' => 11, 'nom' => 'Charlie', 'email' => 'charlie@test.com', 'comite_id' => 3],
            ['id' => 12, 'nom' => 'David', 'email' => 'david@test.com', 'comite_id' => 4],
        ];

        foreach ($benevoles as $benevole) {
            Benevole::create($benevole);
        }

        // Plages horaires (basées sur vos mocks eventsData)
        $plagesHoraires = [
            [
                'id' => 1,
                'titre' => 'Developers Meeting',
                'date_debut' => '2018-06-01 10:00:00',
                'date_fin' => '2018-06-01 11:00:00',
                'recurrence_regle' => 'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR',
                'recurrence_exception' => '20180606T000000Z',
                'comite_id' => 1,
                'is_all_day' => false,
            ],
            [
                'id' => 2,
                'titre' => 'ModOcc',
                'date_debut' => '2018-06-05 10:00:00',
                'date_fin' => '2018-06-05 11:00:00',
                'recurrence_id' => 1,
                'comite_id' => 1,
                'is_all_day' => false,
            ]
        ];

        foreach ($plagesHoraires as $plage) {
            PlageHoraire::create($plage);
        }

        // Relations many-to-many entre plages et postes (basées sur PosteIDs)
        $plage1 = PlageHoraire::find(1);
        $plage1->postes()->attach([1, 2]); // PosteIDs: [1, 2]

        $plage2 = PlageHoraire::find(2);
        $plage2->postes()->attach([1, 2]); // PosteIDs: [1, 2]
    }
}
