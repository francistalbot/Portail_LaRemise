import { Benevole, Comite, Poste, Succursale } from "@/types/referenceData";

export const succursalData: Succursale[] = [
    { Name: "Vilray", Id: 1, OwnerColor: "#ffaa00" },
    { Name: "Plateau", Id: 2, OwnerColor: "#381814ff" },
];

export const comiteData: Comite[] = [
    { Name: "Comité Bois", Id: 1, OwnerColor: "#f8a398", SuccursalId: 1 },
    { Name: "Comité Outil", Id: 2, OwnerColor: "#7499e1", SuccursalId: 1 },
    { Name: "Comité Vélo", Id: 3, OwnerColor: "#4caf50", SuccursalId: 2 },
    { Name: "Comité TI", Id: 4, OwnerColor: "#ff9800", SuccursalId: 2 },
];
export const posteData: Poste[] = [
    { Name: "Accueil", Id: 1 },
    { Name: "Decouverte", Id: 2 },
];

export const benevoleData: Benevole[] = [
    { Name: "Francis", Id: 1, ComiteId: 1 },
    { Name: "Benois", Id: 2, ComiteId: 1 },
    { Name: "Jean", Id: 3, ComiteId: 2 },
    { Name: "Marie", Id: 4, ComiteId: 2 },
    { Name: "Lucie", Id: 5, ComiteId: 3 },
    { Name: "Paul", Id: 6, ComiteId: 3 },
    { Name: "Pierre", Id: 7, ComiteId: 4 },
    { Name: "Sophie", Id: 8, ComiteId: 4 },
    { Name: "Alice", Id: 9, ComiteId: 1 },
    { Name: "Bob", Id: 10, ComiteId: 2 },
    { Name: "Charlie", Id: 11, ComiteId: 3 },
    { Name: "David", Id: 12, ComiteId: 4 },
];
