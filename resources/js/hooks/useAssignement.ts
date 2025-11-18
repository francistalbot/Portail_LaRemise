import { useState } from "react";
import {
    getAssignments,
    postAffectation,
    updateAffectation,
} from "@/services/assignmentApi";

interface assignmentApiReturn {
    assignments: Record<string, any>[];
    status: string;
    errors: Record<string, string> | null;
    loadAssignments: (eventID: number, date: Date | string) => Promise<void>;
    assignBenevole: (assignment: Record<string, any>) => Promise<void>;
}

export const useAssignment = (): assignmentApiReturn => {
    const [assignments, setAssignments] = useState<Record<string, any>[]>([]);
    const [status, setStatus] = useState<string>("idle");
    const [errors, setErrors] = useState<Record<string, string> | null>(null);

    const handleSuccess = () => {
        setStatus("success");
        setErrors(null);
    };

    const handleError = (errorMessage?: string) => {
        setStatus("error");
        if (errorMessage) {
            setErrors({ general: errorMessage });
        }
    };

    /**
     * Charge les affectations pour un événement et une date donnés
     * Peuple l'état assignments avec les données validées
     */
    const loadAssignments = async (eventID: number, date: Date | string) => {
        setStatus("loading");
        setErrors(null);

        try {
            const data = await getAssignments(eventID, date);
            setAssignments(data);
            handleSuccess();
        } catch (error) {
            handleError(
                error instanceof Error
                    ? error.message
                    : "Erreur lors du chargement des affectations"
            );
            throw error;
        }
    };

    const assignBenevole = async (assignment: Record<string, any>) => {
        setStatus("loading");
        if (!assignment) return;
        if (assignment.Id) {
            // Mise à jour
            try {
                await updateAffectation(assignment.Id, assignment);
                handleSuccess();
            } catch (error) {
                handleError();
                throw error;
            }
        } else {
            // Création
            try {
                await postAffectation(assignment);
                handleSuccess();
            } catch (error) {
                handleError();
                throw error;
            }
        }
    };

    return {
        assignments,
        status,
        errors,
        loadAssignments,
        assignBenevole,
    };
};
