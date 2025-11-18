import { AssignmentList } from "../../resources/js/Components/Scheduler/AssignementList.tsx";
describe("getAssignments - API avec validation Zod", () => {
    beforeEach(() => {
        cy.clock();
    });

    afterEach(() => {
        cy.clock().then((clock) => clock.restore());
    });

    const benevoles = [
        { Id: 5, Name: "Jean Dupont" },
        { Id: 6, Name: "Marie Curie" },
    ];

    const postes = [{ Id: 10, Name: "Sécurité" }];
    const initialAssignments = [
        {
            Id: 1,
            Date: "2024-06-15T00:00:00.000Z",
            PosteID: 10,
            BenevoleID: 5,
            EventID: 1,
        },
    ];
    it("charge et affiche les affectations pour un événement et une date", () => {
        let assignments: Record<string, any>[] = initialAssignments;
        // GET - Récupérer les affectations
        cy.intercept(
            "GET",
            "/api/affectations?eventID=1&date=2024-06-15",
            (req) => {
                req.reply({
                    statusCode: 200,
                    body: assignments,
                });
            }
        ).as("getAssignments");
        // PUT - Mettre à jour une affectation
        cy.intercept("PUT", "/api/affectations/*", (req) => {
            const assignmentId = parseInt(req.url.split("/").pop() || "0");
            const assignmentIndex = assignments.findIndex(
                (a) => a.Id === assignmentId
            );
            if (assignmentIndex !== -1) {
                assignments[assignmentIndex] = {
                    Id: assignmentId,
                    Date: req.body.Date,
                    PosteID: req.body.PosteID,
                    BenevoleID: req.body.BenevoleID,
                    EventID: req.body.EventID,
                };
            }
            req.reply({
                statusCode: 200,
                body: {
                    Id: parseInt(req.url.split("/").pop() || "0"),
                    Date: req.body.Date,
                    PosteID: req.body.PosteID,
                    BenevoleID: req.body.BenevoleID,
                    EventID: req.body.EventID,
                },
            });
        }).as("updateAffectation");

        cy.mount(
            <AssignmentList
                EventID={1}
                Date="2024-06-15"
                Benevoles={benevoles}
                Postes={postes}
            />
        );
        cy.get('[data-testid="dropdown"]').should("be.visible");
        cy.contains("Chargement").should("be.visible");
        cy.wait("@getAssignments");
        // Vérifier que l'option "Jean Dupont" est sélectionnée
        cy.get('[data-testid="dropdown"]').should("have.value", "5");
    });

    it("crée une nouvelle affectation via l'interface", () => {
        let assignments: Record<string, any>[] = [];

        cy.intercept(
            "GET",
            "/api/affectations?eventID=1&date=2024-06-15",
            (req) => {
                req.reply({
                    statusCode: 200,
                    body: assignments,
                });
            }
        ).as("getAssignments");

        // POST - Créer une nouvelle affectation
        cy.intercept("POST", "/api/affectations", (req) => {
            assignments.push({
                Id: assignments.length + 1,
                Date: req.body.Date,
                PosteID: req.body.PosteID,
                BenevoleID: req.body.BenevoleID,
                EventID: req.body.EventID,
            });
            req.reply({
                statusCode: 201,
                body: {
                    Id: 3,
                    Date: req.body.Date,
                    PosteID: req.body.PosteID,
                    BenevoleID: req.body.BenevoleID,
                    EventID: req.body.EventID,
                },
            });
        }).as("postAffectation");

        cy.mount(
            <AssignmentList
                EventID={1}
                Date="2024-06-15"
                Benevoles={benevoles}
                Postes={postes}
            />
        );
        // Vérifier que le dropdown contient les options (avant sélection)
        cy.get('[data-testid="dropdown"]').should("have.value", "");

        // Sélectionner "Marie Curie" dans le dropdown
        cy.get('[data-testid="dropdown"]').select("6");
        cy.wait("@postAffectation");

        // Vérifier que "Marie Curie" est maintenant sélectionnée
        cy.get('[data-testid="dropdown"]').should("have.value", "6");
    });

    it("remplace un bénévole d'une affectation via l'interface", () => {
        let assignments: Record<string, any>[] = initialAssignments;
        // GET - Récupérer les affectations
        cy.intercept(
            "GET",
            "/api/affectations?eventID=1&date=2024-06-15",
            (req) => {
                req.reply({
                    statusCode: 200,
                    body: assignments,
                });
            }
        ).as("getAssignments");
        // PUT - Mettre à jour une affectation
        cy.intercept("PUT", "/api/affectations/*", (req) => {
            const assignmentId = parseInt(req.url.split("/").pop() || "0");
            const assignmentIndex = assignments.findIndex(
                (a) => a.Id === assignmentId
            );
            if (assignmentIndex !== -1) {
                assignments[assignmentIndex] = {
                    Id: assignmentId,
                    Date: req.body.Date,
                    PosteID: req.body.PosteID,
                    BenevoleID: req.body.BenevoleID,
                    EventID: req.body.EventID,
                };
            }
            req.reply({
                statusCode: 200,
                body: {
                    Id: parseInt(req.url.split("/").pop() || "0"),
                    Date: req.body.Date,
                    PosteID: req.body.PosteID,
                    BenevoleID: req.body.BenevoleID,
                    EventID: req.body.EventID,
                },
            });
        }).as("updateAffectation");

        cy.mount(
            <AssignmentList
                EventID={1}
                Date="2024-06-15"
                Benevoles={benevoles}
                Postes={postes}
            />
        );

        // Sélectionner "Jean Dupont" dans le dropdown
        cy.get('[data-testid="dropdown"]').select("6");
        cy.wait("@updateAffectation");

        // Vérifier que "Jean Dupont" est maintenant sélectionné
        cy.get('[data-testid="dropdown"]').should("have.value", "6");
    });
});
