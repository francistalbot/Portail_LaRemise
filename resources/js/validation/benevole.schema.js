import { z } from "zod";

export const AssignmentSchema = z
    .object({
        nom: z
            .string({ required_error: "Le nom est requis" })
            .min(1, "Le nom ne peut pas être vide")
            .max(100, "Le nom ne peut pas dépasser 100 caractères"),
        email: z
            .string()
            .email("L'adresse courriel n'est pas valide")
            .optional(),
        slackUserId: z
            .string()
            .min(1, "L'identifiant Slack ne peut pas être vide")
            .max(100, "L'identifiant Slack ne peut pas dépasser 100 caractères")
            .optional(),
        comite_id: z
            .number({ invalid_type_error: "Le comité doit être un nombre" })
            .int("Le comité doit être un nombre entier")
            .positive("Le comité doit être un nombre positif")
            .optional(),
    })
    .strict();
