import { useAssignment } from "@/hooks/useAssignement";
import { Assignment } from "@/types/assignment";
import { Benevole, Poste } from "@/types/referenceData";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { useEffect, useState } from "react";

interface AssignementListProps {
    EventID: number;
    Date: Date | string;
    Benevoles: Record<string, any>[];
    Postes: Record<string, any>[];
}
export const AssignmentList = ({
    EventID,
    Date,
    Benevoles,
    Postes,
}: AssignementListProps): JSX.Element => {
    const { assignments, status, errors, loadAssignments, assignBenevole } =
        useAssignment();
    useEffect(() => {
        loadAssignments(EventID, Date);
    }, []);

    const AssignementDropdown = ({
        poste,
        assignment,
    }: {
        poste: Record<string, any>;
        assignment?: Record<string, any>;
    }): JSX.Element => {
        const handleSelectionChange = async (benevoleID: number) => {
            assignBenevole({
                BenevoleID: benevoleID,
                EventID,
                Date,
                PosteID: poste.Id,
                Id: assignment?.Id,
            }).then(() => {
                loadAssignments(EventID, Date);
            });
        };

        return (
            <div>
                <DropDownListComponent
                    key={assignment?.Id}
                    dataSource={Benevoles.map((b) => ({
                        text: b.Name,
                        value: b.Id,
                    }))}
                    fields={{
                        text: "text",
                        value: "value",
                    }}
                    value={
                        status === "loading"
                            ? "loading"
                            : assignment?.BenevoleID || ""
                    }
                    placeholder={
                        status === "loading"
                            ? "Chargement..."
                            : "Sélectionner un bénévole"
                    }
                    enabled={status !== "loading"}
                    floatLabelType="Always"
                    change={(e: any) => handleSelectionChange(e.value)}
                />
            </div>
        );
    };

    return (
        <div>
            {Postes.map((Poste) => (
                <div key={Poste.Id}>
                    <label>{Poste.Name} :</label>
                    <AssignementDropdown
                        key={Poste.Id}
                        poste={Poste}
                        assignment={assignments.find(
                            (a) => a.PosteID === Poste.Id
                        )}
                    />
                </div>
            ))}
        </div>
    );
};
