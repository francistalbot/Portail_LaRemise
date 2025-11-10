import { z } from "zod";

 export const AssignmentSchema = z.object({
    Id: z.number().int().positive(), // un nombre entier > 0
    Date: z.date(),
    PosteID: z.number().int().positive(),
    BenevoleID: z.number().int().positive(),
    EventID: z.number().int().positive()
 }).strict(); // Aucune clé surprise n’est acceptée