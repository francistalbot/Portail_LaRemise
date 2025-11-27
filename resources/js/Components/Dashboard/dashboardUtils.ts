// Fichier utilitaire pour les fonctions de calcul du dashboard
import { GridData, TimeSlot } from "./DashboardTypes";

export function getTotalPositions(timeSlots: TimeSlot[]): number {
    return timeSlots.reduce((acc, slot) => acc + slot.totalPositions, 0);
}

export function getTotalFilled(timeSlots: TimeSlot[]): number {
    return timeSlots.reduce((acc, slot) => acc + slot.filledPositions, 0);
}

export function getCoveragePercentage(
    totalFilled: number,
    totalPositions: number
): number {
    return totalPositions === 0
        ? 0
        : Math.round((totalFilled / totalPositions) * 100);
}

export function getUrgentPositions(timeSlots: TimeSlot[]): number {
    return timeSlots.flatMap((slot) =>
        slot.positions.filter((pos) => pos.isUrgent)
    ).length;
}

export function getVacantPositions(gridData: GridData[]): number {
    return gridData.filter((item) => item.Benevole === "VIDE").length;
}

export function getCoverageColor(percentage: number): string {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
}

export function getSlotStatus(slot: TimeSlot) {
    const percentage = (slot.filledPositions / slot.totalPositions) * 100;
    if (percentage === 100)
        return { color: "bg-green-100 border-green-500", text: "Complet" };
    if (percentage >= 50)
        return {
            color: "bg-yellow-100 border-yellow-500",
            text: "Partiel",
        };
    return { color: "bg-red-100 border-red-500", text: "Urgent" };
}
