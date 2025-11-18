import axios from "axios";
import { AssignmentSchema } from "@/validation/assignment.schema";
import { z } from "zod";

/**
 * Récupère les affectations pour un événement et une date donnés
 * Valide la réponse avec Zod avant de la retourner
 */
const getAssignments = async (
    eventID: number,
    date: Date | string
): Promise<z.infer<typeof AssignmentSchema>[]> => {
    try {
        // Convertir la date en format ISO si nécessaire
        const dateStr =
            date instanceof Date ? date.toISOString().split("T")[0] : date;

        // Appel API avec paramètres de requête
        const response = await axios.get("/api/affectations", {
            params: {
                eventID,
                date: dateStr,
            },
        });

        // Valider la réponse avec le schéma Zod
        // Parser chaque élément du tableau
        const validatedData = z
            .array(AssignmentSchema)
            .safeParse(response.data);

        if (!validatedData.success) {
            console.error(
                "Erreur de validation Zod:",
                validatedData.error.issues
            );
            throw new Error(JSON.stringify(validatedData.error.format()));
        }

        return validatedData.data;
    } catch (error) {
        throw error;
    }
};

const postAffectation = async (data: Record<string, any>) => {
    const response = await axios.post("/api/affectations", data);
    return response.data;
};
/**
 * Mettre à jour une affectation existante
 */
const updateAffectation = async (id: number, data: Record<string, any>) => {
    const response = await axios.put(`/api/affectations/${id}`, data);
    return response.data;
};

/**
 * Supprimer une affectation
 */
const removeAffectation = async (id: number) => {
    const response = await axios.delete(`/api/affectations/${id}`);
    return response.data;
};

export {
    getAssignments,
    postAffectation,
    updateAffectation,
    removeAffectation,
};
