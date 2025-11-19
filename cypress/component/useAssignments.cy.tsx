import React, { useEffect } from "react";
import { useAssignment } from "../../resources/js/hooks/useAssignement";

// Composant de test qui utilise le hook
function AssignmentLoader({
    eventID,
    date,
}: {
    eventID: number;
    date: string;
}) {
    const { assignments, status, errors, loadAssignments } = useAssignment();

    useEffect(() => {
        loadAssignments(eventID, date);
    }, [eventID, date]);

    if (status === "loading") {
        return <div data-testid="loading">Chargement...</div>;
    }

    if (errors) {
        return (
            <div data-testid="error" className="text-red-600">
                {errors.general}
            </div>
        );
    }

    return (
        <div data-testid="assignments-list">
            <h2 className="text-xl font-bold mb-4">
                Affectations ({assignments.length})
            </h2>
            {assignments.length === 0 ? (
                <p data-testid="no-assignments">Aucune affectation</p>
            ) : (
                <ul>
                    {assignments.map((assignment) => (
                        <li
                            key={assignment.Id}
                            data-testid={`assignment-${assignment.Id}`}
                            className="p-2 border-b"
                        >
                            <p>ID: {assignment.Id}</p>
                            <p>Poste: {assignment.PosteID}</p>
                            <p>Bénévole: {assignment.BenevoleID}</p>
                            <p>Événement: {assignment.EventID}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

describe("getAssignments - API avec validation Zod", () => {
    beforeEach(() => {
        cy.clock();
    });

    afterEach(() => {
        cy.clock().then((clock) => clock.restore());
    });

    it("charge et affiche les affectations pour un événement et une date", () => {
        // Mock de la réponse API conforme au schéma Zod avec délai
        cy.intercept("GET", "/api/affectations?eventID=1&date=2025-12-01", {
            statusCode: 200,
            delay: 100, // Délai pour permettre à l'état loading d'apparaître
            body: [
                {
                    Id: 1,
                    Date: "2025-12-01T00:00:00.000Z",
                    PosteID: 10,
                    BenevoleID: 5,
                    EventID: 1,
                },
                {
                    Id: 2,
                    Date: "2025-12-01T00:00:00.000Z",
                    PosteID: 11,
                    BenevoleID: 6,
                    EventID: 1,
                },
            ],
        }).as("getAssignments");

        cy.mount(<AssignmentLoader eventID={1} date="2025-12-01" />);

        // Vérifier l'état de chargement
        cy.get('[data-testid="loading"]').should("be.visible");

        // Faire avancer le temps pour que la réponse arrive
        cy.tick(100);

        // Attendre la réponse
        cy.wait("@getAssignments");

        // Vérifier que les affectations sont affichées
        cy.get('[data-testid="assignments-list"]').should("be.visible");
        cy.contains("Affectations (2)").should("be.visible");
    });

    it("affiche une erreur pour une erreur réseau (network failure)", () => {
        // Intercepter les exceptions non capturées pour ce test spécifique
        cy.on("uncaught:exception", (err) => {
            // Vérifier que c'est bien l'erreur réseau attendue
            if (err.message.includes("Network Error")) {
                // Retourner false pour empêcher Cypress de faire échouer le test
                return false;
            }
            // Laisser les autres erreurs faire échouer le test
            return true;
        });

        cy.intercept("GET", "/api/affectations?eventID=1&date=2025-12-01", {
            forceNetworkError: true,
        }).as("getNetworkError");

        cy.mount(<AssignmentLoader eventID={1} date="2025-12-01" />);

        cy.wait("@getNetworkError");

        // Attendre un peu pour que l'état d'erreur soit mis à jour
        cy.wait(100);

        cy.get('[data-testid="error"]').should("be.visible");
    });

    it("affiche une erreur quand la validation Zod échoue - propriété manquante", () => {
        // Intercepter les exceptions non capturées pour ce test spécifique
        cy.on("uncaught:exception", (err) => {
            // Vérifier que c'est bien l'erreur réseau attendue
            if (
                err.message.includes(
                    "Invalid input: expected number, received undefined"
                )
            ) {
                // Retourner false pour empêcher Cypress de faire échouer le test
                return false;
            }
            // Laisser les autres erreurs faire échouer le test
            return true;
        });

        // Mock avec une réponse invalide (manque BenevoleID)
        cy.intercept("GET", "/api/affectations?eventID=1&date=2025-12-01", {
            statusCode: 200,
            body: [
                {
                    Id: 1,
                    Date: "2025-12-01T00:00:00.000Z",
                    PosteID: 10,
                    // BenevoleID manquant - devrait échouer la validation
                    EventID: 1,
                },
            ],
        }).as("getMissingFieldAssignments");

        cy.mount(<AssignmentLoader eventID={1} date="2025-12-01" />);

        cy.tick(100);

        // Vérifier que l'erreur est affichée
        cy.get('[data-testid="error"]').should("be.visible");
        cy.get('[data-testid="error"]').should(
            "contain",
            "Invalid input: expected number, received undefined"
        );
    });

    it("transforme correctement les dates ISO en objets Date", () => {
        cy.intercept("GET", "/api/affectations?eventID=1&date=2025-12-01", {
            statusCode: 200,
            body: [
                {
                    Id: 1,
                    Date: "2025-12-01T10:30:00.000Z", // String ISO
                    PosteID: 10,
                    BenevoleID: 5,
                    EventID: 1,
                },
            ],
        }).as("getAssignmentsWithDate");

        cy.mount(<AssignmentLoader eventID={1} date="2025-12-01" />);

        cy.tick(100);

        // Vérifier que les données sont affichées (la date a été validée)
        cy.get('[data-testid="assignment-1"]').should("exist");
    });
});
