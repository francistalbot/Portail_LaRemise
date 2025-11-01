import { Assignment } from "@/types/assignment";
import { Benevole, Poste } from "@/types/referenceData";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { useEffect, useState } from "react";

interface PosteAssignmentDropdownProps {
    eventID: string;
    date: Date;
    benevoles: Benevole[];
    poste: Poste;
    assignment?: Assignment;
    onAssignmentChange: () => [
        status: string,
        assignBenevole: (
            benevoleID: number | null,
            eventID: string,
            date: Date,
            assignmentID?: number
        ) => Promise<{ BenevoleID: number }>
    ];
}

export const PosteAssignmentDropdown = ({
    eventID,
    date,
    benevoles,
    poste,
    assignment,
    onAssignmentChange,
}: PosteAssignmentDropdownProps): JSX.Element => {
    const [selectedBenevoleID, setSelectedBenevoleID] = useState<number | null>(
        assignment ? assignment.BenevoleID : null
    );

    // Récupérer les fonctions depuis onAssignmentChange
    const [status, assignBenevole] = onAssignmentChange();

    // Fonction pour gérer le changement de sélection
    const handleSelectionChange = async (newBenevoleID: number | null) => {
        if (newBenevoleID === selectedBenevoleID || status !== "idle") return; // Pas de changement

        try {
            // Assigner le bénévole au poste
            const result = await assignBenevole(
                newBenevoleID,
                eventID,
                date,
                assignment?.Id // Si il y a déjà une affectation, on la met à jour
            );

            // Utiliser la valeur retournée par la promesse
            if (result && result.BenevoleID) {
                setSelectedBenevoleID(result.BenevoleID);
            }
        } catch (error) {
            console.error("Erreur lors de l'assignement:", error);
        }
    };

    return (
        <div>
            <DropDownListComponent
                key={poste.Id}
                dataSource={benevoles.map((b) => ({
                    text: b.Name,
                    value: b.Id,
                }))}
                fields={{
                    text: "text",
                    value: "value",
                }}
                placeholder={poste.Name}
                value={selectedBenevoleID || ""}
                floatLabelType="Always"
                enabled={status !== "loading"}
                change={(e: any) => handleSelectionChange(e.value || null)}
            />
            {status === "loading" && (
                <div className="text-sm text-gray-500 mt-1">Chargement...</div>
            )}
            {status === "error" && (
                <div className="text-sm text-red-500 mt-1">
                    Erreur lors de l'assignement
                </div>
            )}
        </div>
    );
};
