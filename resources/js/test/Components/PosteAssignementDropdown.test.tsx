import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@syncfusion/ej2-react-dropdowns", async () => {
    const actual = await vi.importActual("@/test/mocks/syncfusion");
    return actual;
});

import { PosteAssignmentDropdown } from "../../Components/Scheduler/PosteAssignmentDropdown";

describe("PosteAssignmentDropdown", () => {
    let currentStatus = "idle";
    const mockAssignBenevole = vi.fn();
    const mockOnAssignmentChange = vi.fn();

    const defaultProps = {
        eventID: "1",
        date: new Date("2024-01-01"),
        benevoles: [
            { Id: 1, Name: "Bénévole 1", ComiteId: 1 },
            { Id: 2, Name: "Bénévole 2", ComiteId: 1 },
        ],
        poste: { Id: 1, Name: "Poste 1" },
        onAssignmentChange: mockOnAssignmentChange,
    };

    const assignmentMock = {
        Id: 1,
        BenevoleID: 1,
        EventID: 1,
        PosteID: 1,
        Date: new Date("2024-01-01"),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        currentStatus = "idle";
        mockAssignBenevole.mockResolvedValue(undefined);

        // Mock retourne un tuple [status, assignBenevole]
        mockOnAssignmentChange.mockReturnValue([
            currentStatus,
            mockAssignBenevole,
        ]);
    });

    it("renders dropdown with poste name as placeholder", () => {
        render(<PosteAssignmentDropdown {...defaultProps} />);

        expect(screen.getByDisplayValue("Poste 1")).toBeInTheDocument();
    });

    it("renders with benevoles as options", () => {
        render(<PosteAssignmentDropdown {...defaultProps} />);

        expect(screen.getByText("Bénévole 1")).toBeInTheDocument();
        expect(screen.getByText("Bénévole 2")).toBeInTheDocument();
    });

    it("shows current assignment when provided", () => {
        render(
            <PosteAssignmentDropdown
                {...defaultProps}
                assignment={assignmentMock}
            />
        );

        const dropdown = screen.getByRole("combobox");
        expect(dropdown).toHaveValue("1");
    });

    it("calls onAssignmentChange on component mount", () => {
        render(<PosteAssignmentDropdown {...defaultProps} />);

        expect(mockOnAssignmentChange).toHaveBeenCalled();
    });

    it("calls assignBenevole when new benevole is selected", () => {
        render(<PosteAssignmentDropdown {...defaultProps} />);

        const dropdown = screen.getByRole("combobox");
        fireEvent.change(dropdown, { target: { value: "2" } });

        expect(mockAssignBenevole).toHaveBeenCalledWith(
            2,
            "1",
            new Date("2024-01-01"),
            undefined
        );
    });

    it("disables dropdown during loading state", () => {
        mockOnAssignmentChange.mockReturnValue(["loading", mockAssignBenevole]);

        render(<PosteAssignmentDropdown {...defaultProps} />);

        const dropdown = screen.getByRole("combobox");
        expect(dropdown).toBeDisabled();
        expect(screen.getByText("Chargement...")).toBeInTheDocument();
    });

    it("starts with idle status, assigns benevole, moves to success and confirms value", async () => {
        mockAssignBenevole.mockResolvedValue({ BenevoleID: 2 });
        render(<PosteAssignmentDropdown {...defaultProps} />);
        const dropdown = screen.getByRole("combobox");

        fireEvent.change(dropdown, { target: { value: 2 } });

        await waitFor(() => {
            expect(dropdown).toHaveValue("2");
        });
    });
});
