import { z } from "zod";

export const AssignmentSchema = z
    .object({
        Nom: z
            .string({ required_error: "Le nom est requis" })
            .min(1, "Le nom ne peut pas être vide")
            .max(100, "Le nom ne peut pas dépasser 100 caractères"),
        Prenom: z
            .string({ required_error: "Le prénom est requis" })
            .min(1, "Le prénom ne peut pas être vide")
            .max(100, "Le prénom ne peut pas dépasser 100 caractères"),
        Telephone: z
            .string()
            .min(10, "Le téléphone doit contenir au moins 10 caractères")
            .max(15, "Le téléphone ne peut pas dépasser 15 caractères")
            .optional(),
        Email: z
            .string()
            .email("L'adresse courriel n'est pas valide")
            .optional(),
        SlackUserId: z
            .string()
            .min(1, "L'identifiant Slack ne peut pas être vide")
            .max(100, "L'identifiant Slack ne peut pas dépasser 100 caractères")
            .optional(),
        ComiteID: z
            .number({ invalid_type_error: "Le comité doit être un nombre" })
            .int("Le comité doit être un nombre entier")
            .positive("Le comité doit être un nombre positif")
            .optional(),
    })
    .strict();
