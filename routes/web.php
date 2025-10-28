<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReferenceDataController;
use App\Http\Controllers\PlageHoraireController;
use App\Http\Controllers\AffectationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/calendar', function () {
    return Inertia::render('Calendar');
})->name('calendar');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Routes API pour les données de référence
Route::prefix('api')->group(function () {
    // Route principale pour toutes les données de référence
    Route::get('/reference-data', [ReferenceDataController::class, 'index'])->name('reference-data.index');
    
    // Succursales
    Route::get('/succursales', [ReferenceDataController::class, 'succursales'])->name('succursales.index');
    Route::post('/succursales', [ReferenceDataController::class, 'storeSuccursale'])->name('succursales.store');
    
    // Comités
    Route::get('/comites', [ReferenceDataController::class, 'comites'])->name('comites.index');
    Route::post('/comites', [ReferenceDataController::class, 'storeComite'])->name('comites.store');
    Route::get('/succursales/{succursale}/comites', [ReferenceDataController::class, 'comitesBySuccursale'])->name('comites.by-succursale');
    
    // Postes
    Route::get('/postes', [ReferenceDataController::class, 'postes'])->name('postes.index');
    Route::post('/postes', [ReferenceDataController::class, 'storePoste'])->name('postes.store');
    
    // Bénévoles
    Route::get('/benevoles', [ReferenceDataController::class, 'benevoles'])->name('benevoles.index');
    Route::post('/benevoles', [ReferenceDataController::class, 'storeBenevole'])->name('benevoles.store');
    Route::get('/comites/{comite}/benevoles', [ReferenceDataController::class, 'benevolesByComite'])->name('benevoles.by-comite');
    
    // Plages horaires
    Route::get('/plages-horaires', [PlageHoraireController::class, 'index'])->name('plages-horaires.index');
    Route::post('/plages-horaires', [PlageHoraireController::class, 'store'])->name('plages-horaires.store');

    // Affectations
    Route::get('/affectations', [AffectationController::class, 'index'])->name('affectations.index');
    Route::post('/affectations', [AffectationController::class, 'store'])->name('affectations.store');

});

require __DIR__.'/auth.php';
