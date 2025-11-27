import { Head, Link } from "@inertiajs/react";
import { GridData, TimeSlot, Position, Volunteer } from "./DashboardTypes";
import {
    getTotalPositions,
    getTotalFilled,
    getCoveragePercentage,
    getUrgentPositions,
    getVacantPositions,
    getCoverageColor,
    getSlotStatus,
} from "./dashboardUtils";
import { HeroSection } from "../HeroSection";

export const Dashboard = () => {
    // Données existantes
    const gridData: GridData[] = [
        {
            Time: "15:00",
            Succursal: "Plateau",
            Comite: "Bois",
            Poste: "Accueil",
            Benevole: "Benoit Desjarlais",
        },
        {
            Time: "15:00",
            Succursal: "Plateau",
            Comite: "Bois",
            Poste: "Orientation",
            Benevole: "Mandy Lavoix",
        },
        {
            Time: "15:00",
            Succursal: "Plateau",
            Comite: "Bois",
            Poste: "Découverte",
            Benevole: "VIDE",
        },
    ];

    // Données mockées pour les nouvelles fonctionnalités
    const mockTimeSlots: TimeSlot[] = [
        {
            id: "1",
            time: "8h00 - 12h00",
            date: "2025-09-27",
            totalPositions: 4,
            filledPositions: 2,
            positions: [
                {
                    id: "1",
                    name: "Accueil",
                    volunteer: "Marie Dubois",
                    isUrgent: false,
                },
                {
                    id: "2",
                    name: "Cuisine",
                    volunteer: "Jean Martin",
                    isUrgent: false,
                },
                {
                    id: "3",
                    name: "Distribution",
                    volunteer: "",
                    isUrgent: true,
                },
                { id: "4", name: "Nettoyage", volunteer: "", isUrgent: true },
            ],
        },
        {
            id: "2",
            time: "12h00 - 16h00",
            date: "2025-09-27",
            totalPositions: 3,
            filledPositions: 3,
            positions: [
                {
                    id: "5",
                    name: "Accueil",
                    volunteer: "Sophie Tremblay",
                    isUrgent: false,
                },
                {
                    id: "6",
                    name: "Distribution",
                    volunteer: "Pierre Lavoie",
                    isUrgent: false,
                },
                {
                    id: "7",
                    name: "Accompagnement",
                    volunteer: "Claire Bouchard",
                    isUrgent: false,
                },
            ],
        },
        {
            id: "3",
            time: "16h00 - 20h00",
            date: "2025-09-27",
            totalPositions: 3,
            filledPositions: 1,
            positions: [
                {
                    id: "8",
                    name: "Surveillance",
                    volunteer: "Marc Côté",
                    isUrgent: false,
                },
                { id: "9", name: "Fermeture", volunteer: "", isUrgent: true },
                { id: "10", name: "Sécurité", volunteer: "", isUrgent: true },
            ],
        },
    ];

    const mockVolunteers: Volunteer[] = [
        {
            id: "1",
            name: "Julie Bergeron",
            email: "julie@email.com",
            isAvailable: true,
            lastActivity: "2h",
        },
        {
            id: "2",
            name: "David Pelletier",
            email: "david@email.com",
            isAvailable: true,
            lastActivity: "1j",
        },
        {
            id: "3",
            name: "Isabelle Roy",
            email: "isabelle@email.com",
            isAvailable: false,
            lastActivity: "3j",
        },
        {
            id: "4",
            name: "François Gagnon",
            email: "francois@email.com",
            isAvailable: true,
            lastActivity: "5h",
        },
    ];

    // Calculs via utilitaires
    const totalPositions = getTotalPositions(mockTimeSlots);
    const totalFilled = getTotalFilled(mockTimeSlots);
    const coveragePercentage = getCoveragePercentage(
        totalFilled,
        totalPositions
    );
    const urgentPositions = getUrgentPositions(mockTimeSlots);
    const vacantPositions = getVacantPositions(gridData);

    return (
        <div id="dashboard" className="p-6 bg-gray-50 min-h-screen">
            <HeroSection />
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Tableau de bord
                </h1>
                <p className="text-gray-600">Vendredi 27 septembre 2025</p>
            </div>

            {/* Alertes critiques */}
            {(urgentPositions > 0 || vacantPositions > 0) && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                ⚠️ {urgentPositions + vacantPositions} postes
                                urgents à combler
                            </h3>
                            <p className="text-xs text-red-700 mt-1">
                                Certains créneaux ne peuvent pas ouvrir sans ces
                                postes.
                            </p>
                        </div>
                        <div className="ml-auto">
                            <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                                Envoyer alerte
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">
                                Couverture globale
                            </p>
                            <p
                                className={`text-2xl font-bold ${getCoverageColor(
                                    coveragePercentage
                                )}`}
                            >
                                {coveragePercentage}%
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                            📊
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">
                                Postes comblés
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {totalFilled}/{totalPositions}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                            ✅
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">
                                Postes urgents
                            </p>
                            <p className="text-2xl font-bold text-red-600">
                                {urgentPositions + vacantPositions}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl">
                            🚨
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">
                                Bénévoles disponibles
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                {
                                    mockVolunteers.filter((v) => v.isAvailable)
                                        .length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                            👥
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Postes aujourd'hui - Version améliorée */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Postes aujourd'hui
                            </h2>
                            <Link className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                Inscrivez-vous
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {/* Table responsive en Tailwind */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Heure
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Succursale
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Comité
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Poste
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bénévole
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {gridData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                item.Benevole === "VIDE"
                                                    ? "bg-red-50"
                                                    : ""
                                            }
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.Time}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.Succursal}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.Comite}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.Poste}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                {item.Benevole === "VIDE" ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        POSTE VACANT
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-900">
                                                        {item.Benevole}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {item.Benevole === "VIDE" ? (
                                                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                                                        Assigner
                                                    </button>
                                                ) : (
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        ⋯
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Bénévoles disponibles */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Bénévoles disponibles
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {mockVolunteers.map((volunteer) => (
                                <div
                                    key={volunteer.id}
                                    className={`p-3 rounded-lg border ${
                                        volunteer.isAvailable
                                            ? "border-green-200 bg-green-50"
                                            : "border-gray-200 bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {volunteer.name}
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                {volunteer.email}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Actif il y a{" "}
                                                {volunteer.lastActivity}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span
                                                className={`w-3 h-3 rounded-full ${
                                                    volunteer.isAvailable
                                                        ? "bg-green-500"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            {volunteer.isAvailable && (
                                                <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                                                    Contacter
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                            <button className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-colors">
                                Voir tous les bénévoles
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions rapides */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Actions rapides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-red-600 text-white p-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                        <span className="text-xl">🚨</span>
                        Alerte générale
                    </button>
                    <button className="bg-yellow-600 text-white p-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
                        <span className="text-xl">📧</span>
                        Rappel automatique
                    </button>
                    <button className="bg-green-600 text-white p-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <span className="text-xl">➕</span>
                        Ajouter bénévole
                    </button>
                </div>
            </div>
        </div>
    );
};
