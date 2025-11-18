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
                    body: { id: 1 },
                    delay: 1000,
                });
            }).as("createBenevole");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur remplit et soumet le formulaire
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
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
            cy.get('[data-testid="input-prenom"]').should("be.disabled");
        });

        it("affiche l'état de succès (success) après création réussie", () => {
            // Given: Le formulaire avec une API qui répond avec succès
            cy.intercept("POST", "/api/benevoles", {
                statusCode: 201,
                body: { id: 1 },
            }).as("createBenevole");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur soumet un formulaire valide
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="submit-button"]').click();

            cy.wait("@createBenevole");
            cy.tick(100);

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

            // When: L'utilisateur soumet le formulaire
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="submit-button"]').click();

            cy.wait("@createBenevoleFail");
            cy.tick(100);

            // Then: Un message d'erreur est affiché
            cy.get('[data-testid="error-nom"]').should(
                "contain",
                "Une erreur est survenue lors de la création"
            );
        });
    });

    describe("Saisie et validation des champs", () => {
        it("permet de saisir du texte dans tous les champs", () => {
            // Given: Le formulaire est monté
            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur remplit tous les champs
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="input-telephone"]').type("5145551234");
            cy.get('[data-testid="input-email"]').type("jean@example.com");
            cy.get('[data-testid="input-slack"]').type("U12345678");
            cy.get('[data-testid="select-comite"]').select("1");

            // Then: Les valeurs sont correctement affichées
            cy.get('[data-testid="input-nom"]').should("have.value", "Dupont");
            cy.get('[data-testid="input-prenom"]').should("have.value", "Jean");
            cy.get('[data-testid="input-telephone"]').should(
                "have.value",
                "5145551234"
            );
            cy.get('[data-testid="input-email"]').should(
                "have.value",
                "jean@example.com"
            );
            cy.get('[data-testid="input-slack"]').should(
                "have.value",
                "U12345678"
            );
            cy.get('[data-testid="select-comite"]').should("have.value", "1");
        });

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

        it("affiche une erreur pour un email invalide", () => {
            // Given: Le formulaire est monté
            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur entre un email invalide
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="input-email"]').type("email-invalide");
            cy.get('[data-testid="submit-button"]').click();

            // Then: L'erreur de validation est affichée
            cy.get('[data-testid="error-email"]').should(
                "contain",
                "L'adresse courriel n'est pas valide"
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

        it("envoie uniquement les champs requis si les optionnels sont vides", () => {
            // Given: Le formulaire avec une API interceptée
            cy.intercept("POST", "/api/benevoles", (req) => {
                expect(req.body).to.deep.equal({
                    Nom: "Dupont",
                    Prenom: "Jean",
                });
                req.reply({
                    statusCode: 201,
                    body: { id: 1 },
                });
            }).as("createBenevole");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur remplit uniquement les champs requis
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="submit-button"]').click();

            // Then: Seuls les champs requis sont envoyés
            cy.wait("@createBenevole");
        });

        it("gère les erreurs de validation retournées par l'API", () => {
            // Given: Le formulaire avec une API qui retourne des erreurs de validation
            cy.intercept("POST", "/api/benevoles", {
                statusCode: 422,
                body: {
                    errors: {
                        Nom: ["Le nom est déjà utilisé"],
                        Email: ["Cet email existe déjà"],
                    },
                },
            }).as("createBenevoleFail");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur soumet le formulaire
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="input-email"]').type("jean@example.com");
            cy.get('[data-testid="submit-button"]').click();

            cy.wait("@createBenevoleFail");
            cy.tick(100);

            // Then: Les erreurs API sont affichées
            cy.get('[data-testid="error-nom"]').should(
                "contain",
                "Le nom est déjà utilisé"
            );
            cy.get('[data-testid="error-email"]').should(
                "contain",
                "Cet email existe déjà"
            );
        });
    });

    describe("Liste déroulante des comités", () => {
        it("affiche tous les comités dans la liste déroulante", () => {
            // Given: Le formulaire avec une liste de comités
            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur clique sur le select
            // Then: Tous les comités sont disponibles
            cy.get('[data-testid="select-comite"]')
                .find("option")
                .should("have.length", 3); // Placeholder + 2 comités

            cy.get('[data-testid="select-comite"]')
                .find("option")
                .eq(0)
                .should("contain", "-- Sélectionner un comité --");

            cy.get('[data-testid="select-comite"]')
                .find("option")
                .eq(1)
                .should("contain", "Comité A");

            cy.get('[data-testid="select-comite"]')
                .find("option")
                .eq(2)
                .should("contain", "Comité B");
        });

        it("permet de sélectionner un comité", () => {
            // Given: Le formulaire est monté
            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur sélectionne un comité
            cy.get('[data-testid="select-comite"]').select("Comité B");

            // Then: Le comité est sélectionné
            cy.get('[data-testid="select-comite"]').should("have.value", "2");
        });
    });

    describe("Message de succès", () => {
        it("affiche et maintient le message de succès après création", () => {
            // Given: Le formulaire avec une API qui répond avec succès
            cy.intercept("POST", "/api/benevoles", {
                statusCode: 201,
                body: { id: 1 },
            }).as("createBenevole");

            cy.mount(<BenevoleForm comites={mockComites} />);

            // When: L'utilisateur soumet un formulaire valide
            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="submit-button"]').click();

            cy.wait("@createBenevole");
            cy.tick(100);

            // Then: Le message de succès persiste
            cy.get('[data-testid="success-message"]').should("be.visible");
            cy.tick(5000);
            cy.get('[data-testid="success-message"]').should("be.visible");
        });

        it("efface le message de succès lors d'une nouvelle soumission", () => {
            // Given: Le formulaire avec un message de succès affiché
            cy.intercept("POST", "/api/benevoles", {
                statusCode: 201,
                body: { id: 1 },
            }).as("createBenevole");

            cy.mount(<BenevoleForm comites={mockComites} />);

            cy.get('[data-testid="input-nom"]').type("Dupont");
            cy.get('[data-testid="input-prenom"]').type("Jean");
            cy.get('[data-testid="submit-button"]').click();
            cy.wait("@createBenevole");
            cy.tick(100);

            cy.get('[data-testid="success-message"]').should("exist");

            // When: L'utilisateur soumet à nouveau
            cy.get('[data-testid="input-nom"]').type("Martin");
            cy.get('[data-testid="input-prenom"]').type("Marie");
            cy.get('[data-testid="submit-button"]').click();

            // Then: Le message de succès disparaît immédiatement
            cy.get('[data-testid="success-message"]').should("not.exist");
        });
    });
});
