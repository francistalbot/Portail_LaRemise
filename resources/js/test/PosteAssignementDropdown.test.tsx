import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@syncfusion/ej2-react-dropdowns", async () => {
    const actual = await vi.importActual("@/test/mocks/syncfusion");
    return actual;
});

import { PosteAssignmentDropdown } from "../Components/Scheduler/PosteAssignmentDropdown";

describe("PosteAssignmentDropdown", () => {
    const eventID = "1";
    const date = new Date();
    const benevoles = [
        { Id: 1, Name: "Bénévole 1", ComiteId: 1 },
        { Id: 2, Name: "Bénévole 2", ComiteId: 1 },
    ];
    const poste = { Id: 1, Name: "Poste 1" };
    const assignment = {
        Id: 1,
        BenevoleID: 1,
        EventID: 1,
        PosteID: 1,
        Date: new Date(),
    };

    it("renders correctly", () => {
        render(
            <PosteAssignmentDropdown
                eventID={eventID}
                date={date}
                benevoles={benevoles}
                poste={poste}
                assignment={assignment}
                onAssignmentChange={vi.fn()}
            />
        );
        expect(screen.getByText("Poste 1")).toBeInTheDocument();
    });
});
