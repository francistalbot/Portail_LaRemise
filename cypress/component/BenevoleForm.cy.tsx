import BenevoleForm from "../../resources/js/Components/BenevoleForm";

describe("BenevoleForm - Formulaire de création de bénévole", () => {
    const mockComites = [
        { id: 1, nom: "Comité A", couleur: "#FF0000", succursale_id: 1 },
        { id: 2, nom: "Comité B", couleur: "#00FF00", succursale_id: 1 },
    ];

    beforeEach(() => {
        cy.clock();
    });

    afterEach(() => {
        cy.clock().then((clock) => clock.restore());
    });

    describe("Rendu et états du formulaire", () => {
        it("affiche le formulaire dans l'état vide (empty) au montage", () => {
            // Given: Le formulaire est monté
            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: Le composant est rendu
            // Then: Tous les champs sont vides et le bouton est actif
            cy.get('[data-testid="input-nom"]').should("have.value", "");
            cy.get('[data-testid="input-prenom"]').should("have.value", "");
            cy.get('[data-testid="input-telephone"]').should("have.value", "");
            cy.get('[data-testid="input-email"]').should("have.value", "");
            cy.get('[data-testid="input-slack"]').should("have.value", "");
            cy.get('[data-testid="select-comite"]').should("have.value", "");
            cy.get('[data-testid="submit-button"]')
                .should("be.enabled")
                .should("contain", "Créer");
        });

        it("affiche l'état de chargement (loading) pendant la soumission", () => {
            // Given: Le formulaire avec une requête API interceptée et ralentie
            cy.intercept("POST", "/api/benevoles", (req) => {
                req.reply({
                    statusCode: 201,
                    delay: 1000,
                });
            }).as("createBenevole");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur remplit et soumet le formulaire
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="input-telephone"]').type("0123456789");
            cy.get('[data-testid="input-email"]').type(
                "jean.dupont@example.com"
            );
            cy.get('[data-testid="input-slack"]').type("jean.dupont");
            cy.get('[data-testid="select-comite"]').select("1");
            cy.get('[data-testid="submit-button"]').click();

            // Then: L'état loading est affiché
            cy.get('[data-testid="submit-button"]')
                .should("be.disabled")
                .should("contain", "En cours...");
            cy.get('[data-testid="loading-message"]').should(
                "contain",
                "Création en cours..."
            );
            cy.get('[data-testid="input-nom"]').should("be.disabled");
        });

        it("affiche l'état de succès (success) après création réussie", () => {
            // Given: Le formulaire avec une API qui répond avec succès
            cy.intercept("POST", "/api/benevoles", {
                statusCode: 201,
                body: { id: 1 },
            }).as("createBenevole");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur remplit et soumet le formulaire
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="input-telephone"]').type("0123456789");
            cy.get('[data-testid="input-email"]').type(
                "jean.dupont@example.com"
            );
            cy.get('[data-testid="input-slack"]').type("jean.dupont");
            cy.get('[data-testid="select-comite"]').select("1");
            cy.get('[data-testid="submit-button"]').click();

            cy.wait("@createBenevole");

            // Then: Le message de succès est affiché et le formulaire est réinitialisé
            cy.get('[data-testid="success-message"]').should(
                "contain",
                "Bénévole créé avec succès !"
            );
            cy.get('[data-testid="input-nom"]').should("have.value", "");
            cy.get('[data-testid="input-prenom"]').should("have.value", "");
        });

        it("affiche l'état d'erreur (error) en cas d'échec API", () => {
            // Given: Le formulaire avec une API qui retourne une erreur
            cy.intercept("POST", "/api/benevoles", {
                statusCode: 500,
                body: { message: "Erreur serveur" },
            }).as("createBenevoleFail");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur remplit et soumet le formulaire
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="input-telephone"]').type("0123456789");
            cy.get('[data-testid="input-email"]').type(
                "jean.dupont@example.com"
            );
            cy.get('[data-testid="input-slack"]').type("jean.dupont");
            cy.get('[data-testid="select-comite"]').select("1");
            cy.get('[data-testid="submit-button"]').click();

            cy.wait("@createBenevoleFail");

            // Then: Un message d'erreur est affiché
            cy.get('[data-testid="error-nom"]').should(
                "contain",
                "Une erreur est survenue lors de la création"
            );
        });
    });

    describe("Saisie et validation des champs", () => {
        it("affiche les erreurs de validation Zod pour les champs requis", () => {
            // Given: Le formulaire est monté
            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur soumet le formulaire sans remplir les champs requis
            cy.get('[data-testid="submit-button"]').click();

            // Then: Les erreurs Zod sont affichées
            cy.get('[data-testid="error-nom"]').should(
                "contain",
                "Le nom ne peut pas être vide"
            );
            cy.get('[data-testid="error-prenom"]').should(
                "contain",
                "Le prénom ne peut pas être vide"
            );
        });

        it("affiche une erreur pour un téléphone trop court", () => {
            // Given: Le formulaire est monté
            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur entre un téléphone de moins de 10 caractères
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="input-telephone"]').type("123");
            cy.get('[data-testid="submit-button"]').click();

            // Then: L'erreur de validation est affichée
            cy.get('[data-testid="error-telephone"]').should(
                "contain",
                "Le téléphone doit contenir au moins 10 caractères"
            );
        });

        it("efface l'erreur d'un champ lorsque l'utilisateur le modifie", () => {
            // Given: Le formulaire avec des erreurs affichées
            cy.mount(<BenevoleForm comites={mockComites} />);
            cy.get('[data-testid="submit-button"]').click();
            cy.get('[data-testid="error-nom"]').should("exist");

            // When: L'utilisateur commence à taper dans le champ en erreur
            cy.get('[data-testid="input-nom"]').type("D");

            // Then: L'erreur disparaît
            cy.get('[data-testid="error-nom"]').should("not.exist");
        });
    });

    describe("Soumission du formulaire", () => {
        it("envoie les données correctes à l'API lors de la soumission", () => {
            // Given: Le formulaire avec une API interceptée
            cy.intercept("POST", "/api/benevoles", (req) => {
                // Vérifier le corps de la requête
                expect(req.body).to.deep.equal({
                    Nom: "Dupont",
                    Prenom: "Jean",
                    Telephone: "5145551234",
                    Email: "jean@example.com",
                    SlackUserId: "U12345678",
                    ComiteID: 1,
                });
                req.reply({
                    statusCode: 201,
                    body: { id: 1 },
                });
            }).as("createBenevole");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur remplit et soumet le formulaire
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="input-telephone"]').type("5145551234");
            cy.get('[data-testid="input-email"]').type("jean@example.com");
            cy.get('[data-testid="input-slack"]').type("U12345678");
            cy.get('[data-testid="select-comite"]').select("1");
            cy.get('[data-testid="submit-button"]').click();

            // Then: La requête est envoyée avec les bonnes données
            cy.wait("@createBenevole");
        });
    });
});
