import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "../../Components/Modal";

describe("Modal Component", () => {
    const defaultProps = {
        children: <div>Modal Content</div>,
        show: true,
        onClose: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders correctly when open", () => {
        render(<Modal {...defaultProps} />);

        expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
        render(<Modal {...defaultProps} show={false} />);

        expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
    });

    it("calls onClose when Escape key is pressed", () => {
        render(<Modal {...defaultProps} />);
        
        // Le modal se ferme avec la touche Escape
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when closeable is false", () => {

        render(<Modal {...defaultProps} closeable={false} />);
        
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
});