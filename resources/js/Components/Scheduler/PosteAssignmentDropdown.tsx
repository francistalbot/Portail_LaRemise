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
    onAssignmentChange: (
        posteID: number,
        benevoleID: number | null,
        eventID: string,
        date: Date,
        assignmentID?: number
    ) => void;
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

    useEffect(() => {
        onAssignmentChange(
            poste.Id,
            selectedBenevoleID,
            eventID,
            date,
            assignment?.Id
        );
    }, [selectedBenevoleID]);

    return (
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
            value={assignment?.BenevoleID || ""}
            floatLabelType="Always"
            change={(e: any) => setSelectedBenevoleID(e.value)}
        />
    );
};
